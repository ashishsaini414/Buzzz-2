import classes from "./eachComment.module.css";
import moment from "moment";
import axios from 'axios';

const EachComment = (props) => {
    const {post, singleComment} = props;
    const { message, ownerOfComment, createdAt } = singleComment;
    const timestamp = moment(createdAt).format("MMMM DD, YYYY | hh:mm A");

    const removeCommentHandler = async (event) =>{
        const {data} = await axios.delete("/deleteComment",{
            data:{
                commentId: singleComment._id,
                postId: post._id
            }
        }).catch(err => console.log(err,"asdasdd"));
        if(!(data === undefined)){
            props.removeComment(data);
        }
        else{ 
            console.log("error")
        }
    }
    return <div className={classes.singleComment}>
                <div className={classes.header}>
                  <div className={classes.leftItems}>   
                    <img src={ownerOfComment.imageUrl} className={classes.ownerImageLink} alt=""></img>
                        <div className={classes.nameAndTime}>
                            <p className={classes.ownerName}>{ownerOfComment.name}</p>
                            <p className={classes.commentTime}>{timestamp}</p>
                        </div>
                    </div>
                    <div className={classes.rightItems}>
                        <span className={classes.commentRemoveIcon} onClick={removeCommentHandler}>
                        <i className="fas fa-trash-alt"></i>
                        </span>
                    </div>
                </div>
                <div className={classes.message}>
                    <p style={{paddingRight: "5px"}}>{message}</p>
                </div>
         </div>
}

export default EachComment;