import AllPosts from "./allPosts/allPosts";
import CreatePost from "./createPost.js/createPost";
import classes from "./posts.module.css";
import { useDispatch } from "react-redux";

const Posts = () => {
  const dispatch = useDispatch();
    dispatch({type: "DELETE_ALL_SAVED_POSTS"})
    dispatch({type: "DELETE_ALL_SAVED_REPORTED_POSTS"})
  return (
    <div className={classes.posts}>
      <div className={classes.createPost}>
        <CreatePost />
      </div>
      <div className={classes.allPosts}>
        <AllPosts />
      </div>
    </div>
  );
};

export default Posts;
