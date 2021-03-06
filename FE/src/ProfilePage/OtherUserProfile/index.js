import { Fragment, useEffect, useState } from "react";
import userLogo from "../../Assets/Images/user_logo.jpg";
import classes from "./index.module.css";
import SampleCoverImage from '../../Assets/Images/blank_wallpaper.jpg'
import { useSelector } from "react-redux";
import setHeaders from "../../Assets/Apis data/fetch";

const OtherUserProfile = (props) => {
  const { getProfileData } = props;
  
  const currentUser = useSelector(state => state.auth.loginUserInfo)

  const [addFriendBoolean, setAddFriendBoolean] = useState(false)
  const [alreadyFriend, setAlreadyFriend] = useState(false)
  const designation = getProfileData.userObject.otherInformation.designation;
  const website = getProfileData.userObject.otherInformation.website;
  const city = getProfileData.userObject.otherInformation.address.city;
  const state = getProfileData.userObject.otherInformation.address.state;
  const zip = getProfileData.userObject.otherInformation.address.zip;

  useEffect(()=>{
    if(getProfileData.userObject.notifications.friendsRequest.includes(currentUser.username)){
      setAddFriendBoolean(true)
    }
    if(getProfileData.userObject.friends.includes(currentUser.username)){
      setAlreadyFriend(true)
    }
  },[getProfileData, currentUser.username])

  // console.log(alreadyFriend,addFriendBoolean)
  // console.log(setHeaders)

  const addFriendHandler = async (friend) => {
    try{
     await fetch("/addFriend",{
          method: "POST",
          headers: setHeaders({ "Content-Type": "application/json"}),
          body: JSON.stringify({loginUser: currentUser.username, friendUser:friend.username})
        }).then(res => res.json()).then(data => {
        // console.log(data)
        if(!data.error){
          setAddFriendBoolean(prevState => !prevState)
        }
        else if(data.error){
          throw new Error(data.error);
        }
      }).catch(error => console.log("add Friend Api error",error))
      }
    catch(err){
      console.log(err);
    }
    
  } 
  return (
    <Fragment>
      <div className={classes.loginUserInformation}>
        <div className={classes.userCoverImage}>
          <img src={getProfileData.userObject.coverImageUrl} className={classes.coverImageUrl} alt="" onError={(e)=> e.target.setAttribute("src",SampleCoverImage)}></img>
        </div>
        <div className={classes.OtherUserInformation}>
        <div>
          <img
            src={getProfileData.userObject.imageUrl}
            className={classes.userProfileImage}
            alt=""
            onError={(e) => e.target.setAttribute("src", userLogo)}
          ></img>
        </div>
        <p className={classes.userName}>{getProfileData.userObject.name}</p>
        <div className={classes.userDetails}>
         {designation !== "" && <p>{designation}</p>}
          { city !== "" && <span>{`${city} *`}</span>}
          { state !== "" && <span>{`${state} *`}</span>}
          { zip !== 0 && <span>{`${zip} | `}</span>}
          <span>{`${getProfileData.userObject.friends.length} friends`}</span>
        </div>
        <div>
          {!alreadyFriend ? !addFriendBoolean ? <button name="addFriend" className={classes.addFriendButton} onClick={() => addFriendHandler(getProfileData.userObject)}>
            <i className="fas fa-user-plus"></i> Add Friend
          </button> :  <button className={classes.requestSentButton}>Request Sent</button> : <button className={classes.alreadyFriendButton}>Already Friend</button>}
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className={classes.VisitWebsiteLink}
          >
            <i className="fas fa-external-link-alt"></i> Visit Website
          </a>
        </div>
        </div>
      </div>
    </Fragment>
  );
};

export default OtherUserProfile;
