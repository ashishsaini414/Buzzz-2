import classes from "./eachComment.module.css";

const EachComment = (props) => {
    const {singleComment} = props;
    const { message, ownerOfComment } = singleComment;
                // console.log(singleComment)
    return <div className={classes.singleComment}>
                <div className={classes.commentOwner}>
                    <img src={ownerOfComment.imageUrl} className={classes.ownerImageLink} alt=""></img>
                    <p className={classes.ownerName}>{ownerOfComment.name}</p>
                </div>
                <div className={classes.message}>
                    <p>{message}</p>
                </div>
         </div>
}

export default EachComment;