import classes from './eachSuggestions.module.css';
import { useEffect, useState } from 'react';
import userLogo from '../Assets/Images/userlogo';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const EachSuggestion = (props) => {

    const { suggestion } = props;
    const navigate = useNavigate();
    const [addFriendBoolean, setAddFriendBoolean] = useState(false)

    const currentUser = useSelector(state => state.auth.loginUserInfo)

    useEffect(()=>{
      if(!suggestion.notifications.friendsRequest.includes(currentUser.username)){
        setAddFriendBoolean(true)
      }
    },[suggestion.notifications.friendsRequest, currentUser.username])

    const addFriendHandler = (friend) => {
        fetch("/addFriend",{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({loginUser: currentUser.username, friendUser:friend.username})
        }).then(res => res.json()).then(data => {
          // console.log(data)
          setAddFriendBoolean(prevState => !prevState)
        })
}
    return(
        <div className={classes.user}>
          <img src={suggestion.imageUrl} className={classes.userImage} onError={(e)=> { e.target.setAttribute("src",userLogo)}} alt=""></img>
          <p  className={classes.userName} onClick={()=> navigate(`/profile/${suggestion.username}`)}>{suggestion.name}</p>
          {addFriendBoolean ? <button className={classes.addUserButton} onClick={(event) => addFriendHandler(suggestion)} >Add</button>
          : <button className={classes.addUserButton}>Request Sent</button>}
        </div>
        )
}

export default EachSuggestion;