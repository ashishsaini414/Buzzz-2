import { useState } from 'react';
import classes from './eachFriendRequestNotification.module.css';
import { useSelector } from 'react-redux';
import setHeaders from '../../Assets/Apis data/fetch';
import { toast } from 'react-toastify';

const EachFriendRequestNotification = (props) => {
    const {notification} = props;
    const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
    
    //here notification variable has the object of that person who send the friend request

    const currentUser = useSelector(state => state.auth.loginUserInfo)
    

    const friendRequestHandler = async () => {
        console.log(notification)
       const response =  await fetch("/acceptFriendRequest",{
           method: "POST",
           headers:setHeaders({ "Content-Type": "application/json" }),
           body:JSON.stringify({loginUser: currentUser.username,friendWhoSentTheFriendRequest : notification.username})
       }).catch(error => console.log("Api failed",error))
       const result = await response.json()
       if(!result.error){
        toast.success("Friend Request Accepted")
        setIsFriendRequestSent(true)
       }
       else if(result.error){
           console.log(result)
       }
    }
     return <div className={classes.EachNotification}>
        <div className={classes.message}>
            <p>{`${notification.name} send you a friend request`}</p>
            </div>
       {!isFriendRequestSent ? <button className={classes.AcceptButton} onClick={friendRequestHandler}>+Accept</button> : 
        <button className={classes.AcceptButton}>Accepted</button>}
        </div>
}

export default EachFriendRequestNotification;