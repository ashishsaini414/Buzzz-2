import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AccountOwnerProfile from "./LoginUserProfile";
import axios from "axios";
import OtherUserProfile from "./OtherUserProfile";

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

  const currentUserUsername = localStorage.getItem("currentUserUsername");

  useEffect(() => {
    async function getProfileData() {
      const { data } = await axios.post("/getProfileData", {
        profileUserUsername: params.id,
        loginUserUsername: currentUserUsername
      });
      // console.log(response)
      setGetProfileData(data);
    }
    getProfileData();
  }, [params, currentUserUsername]);

  // console.log(getProfileData);

  return (
    <Fragment>
     {!getProfileData.isAccountOwner && <OtherUserProfile getProfileData={getProfileData}/>}
     {getProfileData.isAccountOwner && <AccountOwnerProfile getProfileData={getProfileData}/>}    
    </Fragment>
  );
};
export default EachProfilePage;
