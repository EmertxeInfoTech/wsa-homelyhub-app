// import React, { Fragment, useEffect, useState } from "react";
// import "../../CSS/Profile.css";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { updateUser } from "../../store/User/user-action";
// const EditProfile = () => {
//   const { user, errors } = useSelector((state) => state.user);
//   const [name, setName] = useState();
//   const [phoneNumber, setPhoneNumber] = useState();
//   const [avatarPreview, setAvatarPreview] = useState();
//   const [avatar, setAvatar] = useState("");
//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (user) {
//       setName(user.name || "");
//       setPhoneNumber(user.phoneNumber || "");
//       setAvatarPreview(user.avatar.url || "/assets/avatar.png");
//       setAvatar(user.avatar.url);
//     }
//   }, [user]);

//   const navigate = useNavigate();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     console.log(avatar);

//     dispatch(
//       updateUser({
//         name,
//         phoneNumber,
//         avatar,
//       })
//     );
//     navigate("/profile");
//     toast.success("Profile has updated suceessfully");
//   };

//   const onChange = (e) => {
//     const reader = new FileReader();

//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setAvatarPreview(reader.result);
//         setAvatar(reader.result);
//       }
//     };

//     reader.readAsDataURL(e.target.files[0]);
//   };
//   return (
//     <Fragment>
//       <div className="row wrapper ">
//         {user && (
//           <div className="col-10 col-lg-5 updateprofile">
//             <form onSubmit={submitHandler} encType="multipart/form-data">
//               <h1 className="mt-2 mb-5">Update Profile</h1>

//               <div className="form-group">
//                 <label htmlFor="email_field">Name</label>
//                 <input
//                   type="name"
//                   id="name_field"
//                   className="form-control"
//                   name="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="phonenumber_field">Phone Number</label>
//                 <input
//                   type="number"
//                   id="phonenumber_field"
//                   className="form-control"
//                   name="phonenumber"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="avatar_upload">
//                   Avatar
//                   <span style={{ color: "red" }}>*</span>
//                 </label>
//                 <div className="d-flex align-items-center">
//                   <div>
//                     <div className="avatar mr-3 item-rtl">
//                       <img
//                         src={avatarPreview}
//                         className="rounded-circle"
//                         alt="Avatar Preview"
//                       />
//                     </div>
//                   </div>
//                   <div className="custom-file">
//                     <input
//                       type="file"
//                       name="avatar"
//                       className="custom-file-input"
//                       id="avatarupdate"
//                       accept="image/*"
//                       onChange={onChange}
//                     />
//                     <label className="custom-file-label" htmlFor="customFile">
//                       Choose Avatar
//                     </label>
//                     <p className="notes">
//                       (Image size should be less than 20 kb)
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className=" update-btn btn-block "
//                 // disabled={loading ? true : false}
//               >
//                 Update
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </Fragment>
//   );
// };

// export default EditProfile;

import React, { Fragment, useEffect, useState } from "react";
import "../../CSS/Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/User/user-action";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userActions } from "../../store/User/user-slice";

const EditProfile = () => {
  const { user, errors, loading } = useSelector((state) => state.user);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar.url || "https://i.pravatar.cc/150?img=3"
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const originalUserData = {
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
    avatar: user?.avatar?.url || "",
  };

  const onChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        form.setFieldValue("avatar", reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const form = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      avatar: "",
    },
    onSubmit: ({ value }) => {
      const updatedFields = {};

      if (value.name !== originalUserData.name) {
        updatedFields.name = value.name;
      }
      if (value.phoneNumber !== originalUserData.phoneNumber) {
        updatedFields.phoneNumber = value.phoneNumber;
      }
      if (value.avatar !== originalUserData.avatar) {
        updatedFields.avatar = value.avatar;
      }

      if (Object.keys(updatedFields).length === 0) {
        toast("No changes made");
        return;
      }
      console.log(updatedFields);
      dispatch(updateUser(updatedFields));
      navigate("/profile");
      toast.success("Profile Updated");
    },
  });

  useEffect(() => {
    if (errors && errors.length > 0) {
      toast.error(errors);
      dispatch(userActions.clearErrors());
    } else if (user) {
      form.setFieldValue("name", user.name);
      form.setFieldValue("phoneNumber", user.phoneNumber);
      form.setFieldValue(
        "avatar",
        user.avatar.url || "https://i.pravatar.cc/150?img=3"
      );
    }
  }, [user]);

  return (
    <Fragment>
      <div className="row wrapper ">
        <div className="col-10 col-lg-5 updateprofile">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            encType="multipart/form-data"
          >
            <h1 className="mt-2 mb-5">Update Profile</h1>

            {/* <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  return value.trim() === ""
                    ? "name cannot be empty"
                    : undefined;
                },
              }}
            >
              {(field) => (
                <div className="form-group">
                  <label htmlFor="email_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 &&
                    field.state.meta.errors.join(", ")}
                </div>
              )}
            </form.Field> */}

            <form.Field name="name">
              {(field) => (
                <div className="form-group">
                  <label htmlFor="email_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="phoneNumber">
              {(field) => (
                <div className="form-group">
                  <label htmlFor="email_field">Phone Number</label>
                  <input
                    type="number"
                    id="email_field"
                    className="form-control"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="avatar">
              {(field) => (
                <div className="form-group">
                  <label htmlFor="avatar_upload">Avatar</label>
                  <div className="d-flex align-items-center">
                    <div>
                      <figure className="avatar mr-3 item-rtl">
                        <img
                          src={avatarPreview}
                          className="rounded-circle"
                          alt="Avatar Preview"
                        />
                      </figure>
                    </div>
                    <div className="custom-file">
                      <input
                        type="file"
                        name={field.name}
                        className="custom-file-input"
                        id="avatarupdate"
                        accept="image/*"
                        onChange={onChange}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Avatar
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </form.Field>
            <button
              type="submit"
              className=" update-btn btn-block "
              // disabled={loading ? true : false}
            >
              {loading ? "Updating" : "Update"}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditProfile;
