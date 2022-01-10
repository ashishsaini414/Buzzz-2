import { Fragment, useState } from "react";
import classes from './eachFriendComponent.module.css';
import { toast } from 'react-toastify';
import userLogo from '../Assets/Images/userlogo';
import { useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import setHeaders from "../Assets/Apis data/fetch";

const FriendsComponent = (props) => {
  const { data } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

    const [isFriendRemoved, setIsFriendRemoved] = useState(false)
    const currentUser = useSelector(state => state.auth.loginUserInfo)

    const removeFriendHandler = async (friend)=>{
        // console.log(friend)
        try{
          await fetch("/removeFriend",{
            method:"POST",
            headers: setHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ loginUser: currentUser.username, username: data.username})
        }).then(res => res.json())
        .then((response)=>{
          if(!response.error){
            if(response === "Already removed"){
              toast.error("Already removed")
            }
            else{
              props.removeFriend(response.FriendUserResponse)
              dispatch({type: "REMOVE_FRIEND",payload: response.FriendUserResponse})
              toast.success(`${friend.name} removed Successfully `);
              setIsFriendRemoved(true)
            }
          }
          else if(response.error) {
              throw new Error(response.error)
          }
        }).catch(error => console.log(error))
        }
        catch(err){
          console.log(err);
        }
        
    }
  return (
    <Fragment>
        <div className={classes.user}>
          <img src={data.imageUrl} className={classes.userImage} onError={(e)=> e.target.setAttribute("src", userLogo)} alt="" ></img>
          <p className={classes.userName} onClick={()=> navigate(`/profile/${data.username}`)}>{data.name}</p>
          {!isFriendRemoved ? <button className={classes.removeButton} onClick={()=> removeFriendHandler(data)}>Remove</button> :
          <button className={classes.removeButton}>Removed</button>}
          
        </div>
    </Fragment>
  );
};

export default FriendsComponent;
