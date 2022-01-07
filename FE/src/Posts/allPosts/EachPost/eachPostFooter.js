import classes from './eachPostFooter.module.css'
import { useEffect, useState } from 'react'
import EachComment from './EachComment/eachcomment'
import { toast } from 'react-toastify'
import {useSelector} from 'react-redux';
import setHeaders from '../../../Assets/Apis data/fetch';

const EachPostFooter = (props) =>{
    
    const { post } = props
    const [likeToggle, setLikeToggle] = useState(false)
    const [dislikeToggle, setDisLikeToggle] = useState(false)
    const [postComment, setPostComment] = useState("")
    const [commentsShow, setCommentsShow] = useState(true)
    const [allCommentsData, setAllCommentsData] = useState([]);
    const [totalLikesDislikesComments, setTotalLikesDislikesComments] = useState({
        totalLikes: 0,
        totalDislikes: 0,
        totalComments: 0
    })

    const currentUser = useSelector(state => state.auth.loginUserInfo)

    useEffect(()=>{
        if(post.postReactions.likes.includes(currentUser.username)){
            setLikeToggle(prevState => !prevState)
        }
        if(post.postReactions.dislikes.includes(currentUser.username)){
            setDisLikeToggle(prevState => !prevState)
        }
    },[currentUser.username, post.postReactions.likes,post.postReactions.dislikes ])

    useEffect(()=>{
       async function likesDislikesComments(){
            var postDataForLikes = {postId: post._id}
            const response = await fetch("/getPostLikesDislikesCommentsValues",{
                method: "POST",
                headers: setHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify(postDataForLikes)
            }).catch(err => console.error(err))
            const result = await response.json();
            if(!result.error){
                setTotalLikesDislikesComments(result);
            }
            else if(result.error){
                console.log(result)
            }
        }
        likesDislikesComments();
        
    },[likeToggle,dislikeToggle,postComment, post])
    

    const likeButtonHandler = async (likePost, condition) => {
        // console.log(likePost)
       const response =  await fetch("/postReaction",{
            method: "POST",
            headers:setHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({user: currentUser.username, reaction: condition, postId: likePost._id})
        }).catch(err => console.error(err));
        const res = await response.json()
        if(!res.error){
            setLikeToggle(prevState => !prevState)
        }
        else if(res.error){
            console.log(res)
        }
        // console.log(res)
        // setTotalLikes(res.totallikes)
    }
    const dislikeButtonHandler = async (dislikePost, condition) => {
        console.log(dislikePost)
           const response = await fetch("/postReaction",{
                method: "POST",
                headers:setHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({user: currentUser.username, reaction: condition, postId: dislikePost._id})
            }).catch(error =>  console.error(error))
            const result = await response.json();
            if(!result.error){
                setDisLikeToggle(prevState => !prevState)
            }
            else if(result.error){
                console.log(result)
            }
    }

    const commentSubmitHandler = async (event) => {
        event.preventDefault();

          const response =  await fetch("/postComment",{
                method: "POST",
                headers:setHeaders({ "Content-Type": "application/json" }),
                body: JSON.stringify({message: postComment, postId: post._id, user: currentUser.username})
            }).catch(error => console.error(error))
            const result = await response.json();
            if(!result.error){
                setAllCommentsData(prevState => [result, ...prevState])
                setPostComment("")
                toast.success("Comment posted successfully")
            }
            else if(result.error){
                console.log(result);
            }
            // console.log(result)

    }
    const PostAllCommentsHandler = async () =>{
        setCommentsShow(prevState => !prevState)
        if(commentsShow){
                const response = await fetch("/getPostAllComments",{
                    method: "POST",
                    headers: setHeaders({ "Content-Type": "application/json" }),
                    body: JSON.stringify({postId: post._id})
                }).catch(err => console.error(err));
                const result = await response.json()
                if(Array.isArray(result) && result.length === 0){
                    toast.error("No comments")
                }
                if(!result.error){
                    setAllCommentsData(result)
                }
                else if(result.error){
                    console.log(result);
                }
        }
    }

    const removeCommentHandler = (data) => {
        setAllCommentsData(prevState => {
            prevState.forEach((item,index)=>{
                if(item._id === data._id){
                    prevState.splice(index,1)
                }
            })
            return [...prevState]
        });
        setTotalLikesDislikesComments(prevState =>  {
            return {...prevState, totalComments: prevState.totalComments - 1}
        })
        toast.success("Comment removed successfully")
    }
    return(<div>
        <div className={classes.postLikesDislikesCommentsNumbers}>
            <div style={{display: "flex", columnGap: "1em"}}>
                <p className={classes.totalLikes}><span className={classes.likesIcon}><i className="fas fa-thumbs-up"></i></span> {totalLikesDislikesComments.totalLikes}</p>
                <p className={classes.totalDislikes}><span className={classes.dislikesIcon}><i className="fas fa-thumbs-down"></i></span> {totalLikesDislikesComments.totalDislikes}</p>
            </div>
            <p className={classes.totalComments}>
                {`${totalLikesDislikesComments.totalComments}
                  ${totalLikesDislikesComments.totalComments === 1 || totalLikesDislikesComments.totalComments === 0 ? 
                  `comment`: `comments`}`
                }
            </p>
        </div>
        <div className={classes.FirstRow}>
            {!likeToggle ? <button id={classes.likeButton} disabled={dislikeToggle} className={classes.activityButton} onClick={()=>likeButtonHandler(post,"like")}>
                <i className="far fa-thumbs-up"></i> Like</button> : 
            <button id={classes.unlikeButton} className={classes.activityButton} onClick={()=>likeButtonHandler(post,"unlike")}><i className="fas fa-thumbs-up" style={{color: "#3072af"}}></i> Like</button> }

            {!dislikeToggle ? <button id={classes.likeButton} disabled={likeToggle} className={classes.activityButton} onClick={()=>dislikeButtonHandler(post,"dislike")}>
            <i className="far fa-thumbs-down"></i> DisLike</button> : 
            <button id={classes.unlikeButton} className={classes.activityButton} onClick={()=>dislikeButtonHandler(post,"unDislike")}><i className="fas fa-thumbs-down" style={{color: "#3072af"}}></i> DisLike</button> }

            <button id={classes.commentButton} className={classes.activityButton} onClick={PostAllCommentsHandler}>
                <i className="far fa-comment-alt" id={classes.commentButtontext}>
                    </i><span className={classes.LikeText}> Comment</span>
            </button>
        </div>
        <div className={classes.secondRow}>
            <img src={currentUser.imageUrl} className={classes.userImage} alt=""></img>
            <form onSubmit={commentSubmitHandler} className={classes.commentForm}>
                <input className={classes.enterCommentField} value={postComment} onChange={(e)=> setPostComment(e.target.value)} placeholder="Write a comment ..."></input>
            </form>
       
        </div>
        { !commentsShow ? 
            allCommentsData.map((singleComment,index) => {
                return <div key={index}>
                         <EachComment singleComment={singleComment} post={post} removeComment= {removeCommentHandler}/>
                    </div>
            }) : ""
        }
    </div>)
}

export default EachPostFooter;