import classes from "./eachPost.module.css";
import EachPostHeader from "./eachPostHeader";
import EachPostFooter from "./eachPostFooter";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import {Image} from 'cloudinary-react';


const EachPost = (props) => {
  const { post, moderatorMode } = props;
  
  return (
    <>
      <div className={classes.post}>
        <header><EachPostHeader post={post} moderatorMode={moderatorMode}/></header>
        <div className={classes.postMessageBox}>
          <p className={classes.postMessage}>{post.message}</p>
        </div>
        {
          post.imagesUrl.length === 1 && <Image style={{height: "20em",width: "100%"}} cloudName="buzzz-social-site" publicId={post.imagesUrl[0].url}/>
        }
        {post.imagesUrl[0].url !== "" && post.imagesUrl.length > 1 && <div className={classes.postImages}>
          <Carousel autoPlay showArrows={true} showThumbs={false}>
            {post.imagesUrl.map((imageObject,index) => {
              return <div key={index}>
                <Image style={{height: "20em"}} cloudName="buzzz-social-site" publicId={imageObject.url}/>
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
