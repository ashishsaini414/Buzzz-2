import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EachFriendRequestNotification from "./eachFriendRequestNotification";
import classes from "./notifications.module.css";

const NotificationIcon = () => {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const dispatch = useDispatch();

  const allNotifications = useSelector((state) => state.users.allNotifications);
  const currentUser = useSelector(state => state.auth.loginUserInfo)


  useEffect(() => {
    async function getAllNotifications() {
      const response = await fetch("/getAllNotifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginUser: currentUser.username }),
      });
      const result = await response.json();

      dispatch({ type: "ALL_NOTIFICATIONS", payload: result });
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
