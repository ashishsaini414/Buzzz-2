import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AccountOwnerProfile from "./LoginUserProfile";
import axios from "axios";
import OtherUserProfile from "./OtherUserProfile";
import { useSelector } from "react-redux";

const EachProfilePage = () => {

  const [getProfileData, setGetProfileData] = useState({
    userObject:{
      friends: [],
      name:"",
      notifications:{
        friendsRequest: ["ashish"],
      },
      otherInformation:{
        address:{
          city:"",
          state: "",
          zip: null
        },
        birthday: "",
        designation: "",
        gender: "",
        website: ""
      }
    }
  });
  
  const params = useParams();

  const currentUser = useSelector(state => state.auth.loginUserInfo)

  useEffect(() => {
    async function getProfileData() {
      const { data } = await axios.post("/getProfileData", {
        profileUserUsername: params.id,
        loginUserUsername: currentUser.username
      }).catch(error => console.error(error))
      // console.log(response)
      if(!data.error){
        setGetProfileData(data);
      }
      else if(data.error){
        console.log(data);
      }
    }
    getProfileData();
  }, [params, currentUser.username]);

  // console.log(getProfileData);

  return (
    <Fragment>
     {!getProfileData.isAccountOwner && <OtherUserProfile getProfileData={getProfileData}/>}
     {getProfileData.isAccountOwner && <AccountOwnerProfile getProfileData={getProfileData}/>}    
    </Fragment>
  );
};
export default EachProfilePage;
