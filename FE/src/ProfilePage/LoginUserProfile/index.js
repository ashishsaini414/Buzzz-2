import axios from "axios";
import { Fragment, useState, useRef } from "react";
import { toast } from "react-toastify";
import classes from "./index.module.css";
import ProfileForm from "./ProfileForm/profileForm";
import Loader from "../../Assets/Loader/loader";
import { useSelector } from "react-redux";

const LoginUserProfile = (props) => {
  const { getProfileData } = props;

  const [loading, setLoading] = useState(false);
  const inputImageCover = useRef(null);


  // console.log(getProfileData);
  const cloudinaryUrl =
    "https://api.cloudinary.com/v1_1/buzzz-social-site/image/upload";
  const currentUser = useSelector(state => state.auth.loginUserInfo)
    

  const updateProfileHandler = async (e, task) => {
    setLoading(true);
    //api call for image upload on cloudinary
    var coverImageLink = "";
    // console.log(e);
    // console.log(e.target.files[0]);
    if (e.target.files[0]) {
      // console.log("testttt");
      const files = new FormData();
      files.append("file", e.target.files[0]);
      files.append("upload_preset", "mqq4alyl");
      await fetch(cloudinaryUrl, {
        method: "POST",
        body: files,
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          coverImageLink = data.secure_url;
          // console.log('testttt 333333')
        })
        .catch((err) => {
          console.log("File Error - ", err);
          setLoading(false);
        });
    }
    // console.log(coverImageLink);
    // console.log(data);
    //api call for IMAGE LINK upload on db
    try{
      const { data } = await axios.post("/updateProfileData", {
        coverImageLink,
        loginUser: currentUser.username,
        task,
      })
      if(data){
        if(!data.error){
          toast.success(`Image Uploaded Successfully`)
        }
      }
      setLoading(false);
    }
    catch(err){
        if(err.response.data.error){
          console.log(err.response.data.error)
        }
        else {
          console.log(err)
        }
    }
    
  };

  return (
    <Fragment>
      {loading ? <Loader/> : ""}
      <div className={classes.loginUserInformation}>
        <div className={classes.userCoverImage}>
          {getProfileData.userObject.coverImageUrl === "" ? (
            <div className={classes.coverImagesElements}>
              <label htmlFor="coverImage" style={{ cursor: "pointer" }}>
                Upload Image
              </label>
              <input
                type="file"
                id="coverImage"
                ref={inputImageCover}
                onChange={(e) => updateProfileHandler(e, "coverImageUpload")}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <img
              src={getProfileData.userObject.coverImageUrl}
              alt=""
              // onClick={console.log(inputImageCover.current)}
              className={classes.coverImageLink}
            ></img>
          )}
          {getProfileData.userObject.coverImageUrl !== "" && (
            <div className={classes.coverReloadBox}>
              <label
                className={classes.coverImageReloadButton}
                htmlFor="coverImageUpdate"
              >
                UpdateCoverImage
              </label>
              <input
                type="file"
                style={{ display: "none" }}
                id="coverImageUpdate"
                accept=".jpg, .png, .jpeg"
                onChange={(e) => updateProfileHandler(e, "coverImageUpload")}
              />
            </div>
          )}
        </div>
        <div className={classes.userProfileInformation}>
          <div className={classes.profileImageBox}>
            <img
              src={getProfileData.userObject.imageUrl}
              className={classes.userProfileImage}
              alt=""
            ></img>
          </div>
          <label htmlFor="imageUpdate" className={classes.profileImageEdit}>
            <i className="fas fa-camera"></i>
          </label>
          <input
            type="file"
            id="imageUpdate"
            onChange={(e) => updateProfileHandler(e, "profileImageUpload")}
            style={{ display: "none" }}
            accept=" .jpg, .png, .jpeg"
          ></input>
          <p className={classes.userName}>{getProfileData.userObject.name}</p>
          <ProfileForm getProfileData={getProfileData}/>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginUserProfile;
