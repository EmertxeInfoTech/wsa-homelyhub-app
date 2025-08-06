import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Your password must be longer than 6 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      require: [true, "Plesae confim your Password"],
      validate: function (el) {
        return el === this.password;
      },
      message: "Password are not same!",
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      url: { type: String },
      public_id: { type: String },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

//Document middleware
userSchema.pre("save", async function (next) {
  //Only run the function when password is modified
  if (!this.isModified("password")) return next();

  //Hash the password with the salt value as 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete the passwordConfirm feild
  this.passwordConfirm = undefined;
  next();
});

//Instance Method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); //It returns true or false
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export { User };
