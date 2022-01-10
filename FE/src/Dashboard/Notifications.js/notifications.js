import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import setHeaders from "../../Assets/Apis data/fetch";
import EachFriendRequestNotification from "./eachFriendRequestNotification";
import classes from "./notifications.module.css";

const NotificationIcon = () => {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const dispatch = useDispatch();

  const allNotifications = useSelector((state) => state.users.allNotifications);
  // console.log(allNotifications, "notifyyy")
  const currentUser = useSelector(state => state.auth.loginUserInfo)


  useEffect(() => {
    async function getAllNotifications() {
      try{
        //fetch api mai custom error, api ke, result mai hi milega
        const response = await fetch("/getAllNotifications", {
          method: "POST",
          headers: setHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ loginUser: currentUser.username }),
        })
        const result = await response.json();
        if(response.ok){
          if(result){
            dispatch({ type: "ALL_NOTIFICATIONS", payload: result });
          }
        }
        else{
          if(result.error){
            throw new Error(result.error)
          }
        }
      }
      catch(err){
        console.log(err);
      }
      
    }
    getAllNotifications();
  }, [currentUser.username, dispatch]);

  const notificationHandler = () => {
    setShowNotificationPanel((prevState) => !prevState);
  };
  return (
    <div>
      <span className={classes.notificationIcon} onClick={notificationHandler}>
        <i className="fas fa-bell"></i>
      </span>
      {showNotificationPanel ? (
        <div className={classes.notificationList}>
          <div>
            { allNotifications.allFriendRequests.length === 0 ? <p className={classes.noNotificationsMessage}>No New Notifications</p> :
            allNotifications.allFriendRequests.map((notification, index) => {
              return (
                <div key={index}>
                  <EachFriendRequestNotification notification={notification} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default NotificationIcon;
