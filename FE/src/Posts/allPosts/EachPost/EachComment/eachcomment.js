import classes from "./eachComment.module.css";
import moment from "moment";

const EachComment = (props) => {
    const {singleComment} = props;
    const { message, ownerOfComment, createdAt } = singleComment;

    const timestamp = moment(createdAt).format("MMMM DD, YYYY | hh:mm A");
    return <div className={classes.singleComment}>
                <div className={classes.header}>
                    <img src={ownerOfComment.imageUrl} className={classes.ownerImageLink} alt=""></img>
                    <div className={classes.nameAndTime}>
                        <p className={classes.ownerName}>{ownerOfComment.name}</p>
                        <p className={classes.commentTime}>{timestamp}</p>
                    </div>
                </div>
                <div className={classes.message}>
                    <p style={{paddingRight: "5px"}}>{message}</p>
                </div>
         </div>
}

export default EachComment;