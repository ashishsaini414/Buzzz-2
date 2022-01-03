import classes from "./bottomComponent.module.css";
import EachGroup from "./EachRecent/listItem";
import { useSelector } from "react-redux";

const BottomComponent = () => {
  const userObject = useSelector(
    (state) => state.users.loginUserInfo.loginUserObject
  );
  // console.log(userObject);

  return (
    <div className={classes.bottomComponent}>
      <div className={classes.firstComponent}>
        <span>
          <p>Recent</p>
        </span>
        { userObject.recents.length === 0 ? <p>No Recent Activities</p> :
                   userObject.recents.map((group)=>{
                       return <EachGroup group={group}/>
                   })
               }
      </div>
      <div className={classes.secondComponent}>
        <span>
          <p>Groups</p>
        </span>
        { userObject.groups.length === 0 ? <p>No groups</p> :
                   userObject.groups.map((group)=>{
                       return <EachGroup group={group}/>
                   })
               }
      </div>
      <div className={classes.thirdComponent}>
        <span>
          <p>Subscriptions</p>
        </span>
        { userObject.subscriptions.length === 0 ? <p>No subscriptions</p> : 
                   userObject.subscriptions.map((group)=>{
                       return <EachGroup group={group}/>
                   })
               }
      </div>
    </div>
  );
};

export default BottomComponent;
