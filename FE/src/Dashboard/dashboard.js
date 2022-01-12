import { Fragment, useEffect } from "react";
import classes from "./dashboard.module.css";
import Suggestions from "../SuggestionComponent/Suggestions";
import MyFriends from "../FriendsComponent/allFriends";
import Posts from "../Posts/posts";
import UserDashboardComponent from "../UserDashboardComponent";
import NavigationBar from "../NavigationBar/navigationBar";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const selector = useSelector((state) => state.auth.tokenDetails);

  const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const remainingTime = expirationTime - currentTime;
    return remainingTime;
  };

  //setTimeout for auto logout
  useEffect(() => {
    const remainingTime = calculateRemainingTime(selector.tokenExpirationTime);
    console.log("Auto Logout will be in - ", remainingTime, "miliseconds");
    const timer = setTimeout(() => {
      localStorage.clear();
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [selector]);

  return (
    <Fragment>
      <div className={classes.navBar}>
        <NavigationBar />
      </div>
      <div className={classes.dashboard}>
        <div className={classes.UserComponent}>
          <UserDashboardComponent />
        </div>
        <div className={classes.posts}>
          <Posts />
        </div>
        <aside className={classes.asideComponents}>
          <Suggestions key={Math.random().toString()} />
          <MyFriends key={Math.random().toString()} />
        </aside>
      </div>
    </Fragment>
  );
};

export default Dashboard;
