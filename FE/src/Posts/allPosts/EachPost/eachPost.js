import classes from "./eachPost.module.css";
import EachPostHeader from "./eachPostHeader";
import EachPostFooter from "./eachPostFooter";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';


const EachPost = (props) => {
  const { post, moderatorMode } = props;
  
  return (
    <>
      <div className={classes.post}>
        <header><EachPostHeader post={post} moderatorMode={moderatorMode}/></header>
        <div className={classes.postMessageBox}>
          <p className={classes.postMessage}>{post.message}</p>
        </div>
        {post.imagesUrl[0].url !== "" && <div className={classes.postImages}>
          <Carousel autoPlay showArrows={true}>
            {post.imagesUrl.map((imageObject,index) => {
              return <div key={index}>
                <img src={imageObject.url} alt=""/>
              </div>
            })}
          </Carousel>
        </div>}
        <footer><EachPostFooter post={post}/></footer>
      </div>
    </>
  );
};

export default EachPost;
