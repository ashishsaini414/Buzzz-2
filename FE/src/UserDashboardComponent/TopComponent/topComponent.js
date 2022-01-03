import classes from './topComponent.module.css';
import { useSelector  } from 'react-redux';
import SampleCoverImage from '../../Assets/Images/blank_wallpaper.jpg'

const TopComponent = () => {

        const loginUserDataFromDB = useSelector(state => state.users.loginUserInfo) // login user information from direct database with api 

return <div className={classes.topComponent}>
          <img className={classes.coverImage} src={loginUserDataFromDB.loginUserObject.coverImageUrl} height="100%" width="100em" alt=""  onError={(e)=> e.target.setAttribute("src",SampleCoverImage)}></img>
          <div className={classes.userDetails}>
                <img src={loginUserDataFromDB.loginUserObject.imageUrl} className={classes.userImage} alt=""></img>
                <p className={classes.userName}>{loginUserDataFromDB.loginUserObject.name}</p>
                <p className={classes.userTitle}>Newly Recruit at TTN</p>
            </div>
            <div className={classes.userPosts}>
                <div className={classes.startingPart}>
                   <p>{loginUserDataFromDB.profileViews}</p>
                   <p>Profile views</p>
                </div>
                <div className={classes.lastPart}>
                   <p>{loginUserDataFromDB.postCounts}</p>
                   <p>Posts</p>
                </div>
            </div>
    </div>
}

export default TopComponent;