import { User } from "../Models/userModel.js";
import { promisify } from "node:util";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import imagekit from "../utils/ImagekitIO.js";
import { forgotPasswordMailGenContent, sendMail } from "../utils/mail.js";

const signinToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signinToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production", // true for production
  };

  res.cookie("jwt", token, cookieOptions);
  //Remove the password
  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    user,
  });
};

const defaultAvatarUrl = `https://i.pravatar.cc/150?img=3
`;

const filterObj = (obj, ...allowedFeilds) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatar: { url: req.body.avatar || defaultAvatarUrl },
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please Provide email and password");
    }
    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      (await user.correctPassword(password, user.password)) === false
    ) {
      throw new Error("Incorrect email or password");
    }
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(0), // Expire immediately
    httpOnly: true,
    path: "/",
  };

  // Add cross-origin settings for production (when frontend and backend are on different domains)
  if (process.env.NODE_ENV === "production") {
    cookieOptions.sameSite = "none";
    cookieOptions.secure = true;
  } else {
    cookieOptions.sameSite = "lax";
    cookieOptions.secure = false;
  }

  res.cookie("jwt", "", cookieOptions);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
const protect = async (req, res, next) => {
  try {
    //1) Getting the token and check if it is there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt && req.cookies.jwt !== "loggedout") {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error("You are not logged in!! Please login to access");
    }

    //2) Verification Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if the user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error("the user belonging to the token dosen't exists");
    }

    //4) Check if user changed the password after the token is issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("user recently changed the password, Please login again");
    }
    // Grant Access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateMe = async (req, res) => {
  try {
    const filteredBody = filterObj(req.body, "name", "phoneNumber", "avatar");
    if (req.body.avatar !== undefined) {
      let base64Data = req.body.avatar;

      const uploadResponse = await imagekit.upload({
        file: base64Data,
        fileName: `avatar_${Date.now()}.jpg`,
        folder: "avatars",
        transformation: { pre: "w-150,h-150,c-scale" },
      });

      filteredBody.avatar = {
        public_id: uploadResponse.fileId,
        url: uploadResponse.url,
      };
    }

    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      status: "Success",
      data: {
        user: updateUser,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "Fail",
      message: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    // 1) Get User from collection
    const user = await User.findById(req.user.id).select("+password");

    //2) Check if Posted current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      throw new Error("Your current password is wrong");
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //4) Log user in send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).json({
      error: "There is no user with this email",
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:5173/user/resetPassword/${resetToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Reset your Password (valid for 10 mins)",
      mailGenContent: forgotPasswordMailGenContent(user.name, resetURL),
    });

    res
      .status(200)
      .json({ status: "success", message: "Token sent successfully" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    //1) Get user based on token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //2) If token has not expired and there is an user, set a new password
    if (!user) {
      throw new Error("Token is invalid or expired");
    }

    (user.password = req.body.password),
      (user.passwordConfirm = req.body.passwordConfirm);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 3) Log the user in and send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

const check = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Logged In",
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "UnAuthorised",
    });
  }
};
export {
  signup,
  login,
  logout,
  protect,
  updateMe,
  resetPassword,
  forgotPassword,
  updatePassword,
  check,
};
