import { Fragment,useEffect } from "react";
import classes from "./dashboard.module.css";
import Suggestions from "../SuggestionComponent/Suggestions";
import MyFriends from "../FriendsComponent/allFriends";
import Posts from "../Posts/posts";
import UserDashboardComponent from "../UserDashboardComponent";
import NavigationBar from "../NavigationBar/navigationBar";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const selector = useSelector(state => state.auth.tokenDetails)
  console.log("Auto Logout will be in - ",selector.expiresIn,"miliseconds")
  //setTimeout for auto logout
  useEffect(()=>{
    const timer = setTimeout(()=>{
      localStorage.clear()
    },selector.expiresIn)
    return () => clearTimeout(timer);
  },[selector])

  return (
    <Fragment>
      <div className={classes.dashboard}>
        <NavigationBar />
        <div className={classes.middleComponents}>
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
      </div>
    </Fragment>
  );
};

export default Dashboard;
