import NavigationBar from "../NavigationBar/navigationBar";
import Suggestions from "../SuggestionComponent/Suggestions";
import EachProfilePage from "./eachProfilePage";
import classes from "./profilePage.module.css";

const ProfilePage = () => {
  return (
    <div className={classes.wholePage}>
      <NavigationBar />
      <div className={classes.middleParts}>
        <div className={classes.profileDetails}>
          <EachProfilePage />
        </div>
        <div className={classes.suggestions}>
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
