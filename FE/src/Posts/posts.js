import AllPosts from "./allPosts/allPosts";
import CreatePost from "./createPost.js/createPost";
import classes from "./posts.module.css";

const Posts = () => {
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
