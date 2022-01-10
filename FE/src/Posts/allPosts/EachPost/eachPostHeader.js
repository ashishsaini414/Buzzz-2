import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import classes from "./eachPostHeader.module.css";
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment';

const EachPostHeader = (props) => {
  const { post, moderatorMode } = props;
  const { user } = post;
  
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.loginUserInfo)
  
  const [isAlreadyReported, setIsAlreadyReported] = useState(false);
  const [showPostMenu, setShowPostmenu] = useState(false);

  useEffect(() => {
    if (post.reports.includes(currentUser.username)) {
      setIsAlreadyReported(true);
    }
  }, [currentUser.username, post.reports]);

  const reportPostHandler = async (e) => {
      // console.log(e);
      try{
        const { data } = await axios.post("/reportPost", {
          loginUser: currentUser.username,
          reportedPostId: e._id,
        });
        if(data){
          if (data.reports.includes(currentUser.username)) {
            toast.success("Reported Successfully");
            setIsAlreadyReported(true);
          }
        }
      }
      catch(err){
        if(err.response.data.error){
          console.log(err.response.data.error)
        }
        else{
          console.log(err)
        }
      }
  };

  const removePostHandler = async () => {
    try{
      const { data } = await axios.delete("/deletePost", {
        data: {
          postId: post._id,
        },
      });
      if(data){
        dispatch({type: "REMOVE_POST", payload: post._id })
        toast.success("Post deleted Successfully")
      }
    }
    catch(err){
      if(err.response.data.error){
        console.log(err.response.data.error)
      }
      else{
        console.log(err)
      }
    }
      
  };

  const approvePostHandler = async () =>{
    
      try{
        const { data } = await axios.post("/approvePost",{
          postId: post._id,
        });
        if(data){
          toast.success("Post Approved Successfully")
        }
      }
      catch(err){
        if(err.response.data.error){
          console.log(err.response.data.error)
        }
        else{
          console.log(err)
        }
      }
      
  }

  return (
    <div className={classes.PostHeader}>
      <div className={classes.postDeatils}>
        <img
          src={user.imageUrl}
          className={classes.postOwnerImage}
          alt=""
        ></img>
        <div className={classes.middlePart}>
          <p className={classes.postOwnerName}>{user.name}</p>
          <p className={classes.postCreatedDate}>
            {moment(post.createdAt).format("MMMM DD, YYYY | hh:mm A")}
          </p>
        </div>
      </div>

      {showPostMenu && (
        <div className={classes.postMenu}>
          <ul className={classes.postMenuList}>
            {user.username === currentUser.username && !moderatorMode && (
              <li onClick={removePostHandler}>Remove</li>
            )}
            {moderatorMode && <li onClick={removePostHandler}>Remove</li>}
            {!isAlreadyReported && post.user.username !== currentUser.username && (
              <li onClick={() => reportPostHandler(post)}>Report Post</li>
            )}
            <li>Share</li>
          </ul>
        </div>
      )}

      <div className={classes.postMenuAndFlagIcons}>
        <span
          className={classes.postApproveFlagIcon}
          onClick={approvePostHandler}
          style={
            !moderatorMode ? { visibility: "hidden" } : { visibility: "show" }
          }
        >
          <i className="fas fa-check-circle"></i>
        </span>
        <span
          className={classes.postRedFlagIcon}
          style={
            !moderatorMode ? { visibility: "hidden" } : { visibility: "show" }
          }
        >
          <i className="fas fa-flag"></i>
        </span>
        <span
          className={classes.postOptions}
          onClick={() => setShowPostmenu((prevState) => !prevState)}
        >
          <i className="fas fa-ellipsis-h"></i>
        </span>
      </div>
    </div>
  );
};

export default EachPostHeader;
