const users = require("./Model");
const dotenv = require("dotenv")
dotenv.config({ path: "./development.env"})
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require("jsonwebtoken");
const { mongo, Types } = require("mongoose");


module.exports.getAllSuggestions = async (dataFromClient) => {
  const { loginUser } = dataFromClient;
  try {
    const loginUserObject = await users.User.findOne({username: loginUser});
    const allUsersArray = await users.User.find({});

    const newAllSuggestions = allUsersArray.filter(user => {
      if(user.username !== loginUserObject.username){
        if(loginUserObject.friends.length !== 0){
          for(const key in loginUserObject.friends){
              if(user.username !== loginUserObject.friends[key]){
                return user
              }
            }
        }
        else{
          return user
        }
      }
    }
    )
    return newAllSuggestions;
  } catch (error) {
    return error.message;
  }
};

module.exports.createUser = async (data) => {
  try {
    const response = await users.User.create({ ...data });
    return response;
  } catch (error) {
    return error.message;
  }
};

module.exports.getAllFriends = async (loginUser) => {
  try {
    //find the login user
    const response = await users.User.findOne({
      username: loginUser.loginUser,
    });
    //getting all friends of login user

    const result = await response.friends.map(async (user) => {
      var new2 = await users.User.findOne({ username: user });
      return new2;
    });
    const allFriends =  Promise.all(result).then((res) => {
      var Myfriends = [];
      for (const key in res) {
        Myfriends.push(res[key]);
      }
      return Myfriends;
    });
    return allFriends
  } catch (err) {
    return "Not Found";
  }
};

module.exports.addFriend = async (dataFromClient) => {
  const { loginUser, friendUser } = dataFromClient;
  try {
 
    const loginUserObject = await users.User.findOne({username: loginUser})
    const friendUserObject = await users.User.findOne({username: friendUser})

    if(!loginUserObject.friends.includes(friendUser) && !friendUserObject.notifications.friendsRequest.includes(loginUser)){
        const response  = await friendUserObject.updateOne({$push : {"notifications.friendsRequest": loginUser}});
        const res = await users.User.findOne({username: friendUser})

        return {user: res, message: "Friend Request Sent"}
    }
    else{
      return "Already Friend"
    }
    
  } catch (error) {
    return error.message;
  }
};
module.exports.removeFriend = async (removeFriend) => {
  try {
    //find the login user
    const loginUser = await users.User.findOne({
      username: removeFriend.loginUser,
    });
    //find the friend user
    const friendUser = await users.User.findOne({
      username: removeFriend.username,
    });
    //now remove the added friend username from loginuser friend array's
    if (loginUser.friends.includes(removeFriend.username)) {
      await loginUser.updateOne({
        $pull: { friends: removeFriend.username },
      });
      await friendUser.updateOne({
        $pull: { friends: removeFriend.loginUser },
      });

      const loginUserResponse = await users.User.findOne({
        username: removeFriend.loginUser,
      });
      //find the friend user
      const FriendUserResponse = await users.User.findOne({
        username: removeFriend.username,
      });
      return {loginUserResponse, FriendUserResponse};
    } else {
      return "Already removed";
    }
  } catch (error) {
    return error.message;
  }
};

module.exports.googleLogin = async (loginData, res) =>{
  const {tokenId, profileObj: { imageUrl}} = loginData;

  // console.log(tokenId)
  //step-2: Verify the token ... Reference: https://developers.google.com/identity/sign-in/web/backend-auth
  //google-auh-library will verify that the token receive from client side is same as the token use in backend.
  try{
   const ticket =  await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID
    })
   const payload = ticket.getPayload();
   const {email, email_verified, name, given_name, family_name, picture} = payload;
    if(email_verified){
      await users.User.findOne({username: email}).exec(async (err,user)=>{
        if(err){
          res.send({error: "Error"});
        }
        else{
          if(user){
            const {_id, email, name } = user;
            console.log("yes user exits")
            //returning the jwt with existing user data
            //here we have to use "jsonwebtoken" npm module to generate the json web token.
            //Refernce- https://www.npmjs.com/package/jsonwebtoken

            const token = jwt.sign({_id: _id },process.env.JWT_SECRET_KEY,{ expiresIn: "1d"})
            const currentTime = new Date().getTime()
            const tokenExpirationTime = currentTime + 24*60*60*1000; //24*60*60*1000 === 24 hours
            const expiresIn = tokenExpirationTime - currentTime;

            res.send({tokenDetails: {tokenId: token ,expiresIn},user,isNewUserCreated: false})
          }
          else{
            console.log("create new user")
              const newUser = await new users.User({name, username: email, firstName: given_name, lastName: family_name, imageUrl: picture});
              const new22= await newUser.save((err,user)=>{
                if(err){
                  res.send(err.message)
                }
                else{
                 const token = jwt.sign({username: email },process.env.JWT_SECRET_KEY,{ expiresIn: "1d"})
                 const currentTime = new Date().getTime()
                 const tokenExpirationTime = currentTime + 24*60*60*1000; //24*60*60*1000 === 24 hours
                 const expiresIn = tokenExpirationTime - currentTime;
                 res.send({tokenDetails: {tokenId: token ,expiresIn},user,isNewUserCreated: true});
                }
              })
          }
        }
      })
    }
  } 
  catch(err){
    res.send(err.message)
  }
}

module.exports.createPost =async (postData)=>{
        const {message, user, postImages} = postData;
      try{
            const ownerOfPost = await users.User.findOne({username: user})
            const newPost = await users.Posts.create({message, user: ownerOfPost})
            if(postImages.length !== 0){
              for(const key in postImages){
                  const response = await newPost.updateOne({ $push: { imagesUrl: {url: postImages[key]}}});
                }
              }
            else {
                const response = await newPost.updateOne({ $push: { imagesUrl: {url: ""}}});
              }
          const returnPost = await users.Posts.findById(newPost._id)
          return returnPost;
      }
      catch(error){
        return error.message;
      }
}
module.exports.getAllPosts = async (dataReceiveFromClient) => {
  const {username, page } = dataReceiveFromClient;
  const friendsAllPosts = []
  const integerNumberOfPage = parseInt(page)
  const limit = 3;
  const firstIndex = (integerNumberOfPage-1)*limit;
  const lastIndex = integerNumberOfPage*limit;

  try{

    const user = await users.User.findOne({username: username})
    const userAllPosts = await users.Posts.find({"user.username" : username})

    for(const key in user.friends){      
      const result = await users.Posts.find({"user.username": user.friends[key]})
      friendsAllPosts.push(...result)
    }
    const AllPosts = userAllPosts.concat(friendsAllPosts)
    //reversing the all posts for the functionality- latest post on TOP position
    const postsAfterSorting = AllPosts.reverse()
    //for pagination
    const returningAllPosts = postsAfterSorting.slice(firstIndex,lastIndex)

    return returningAllPosts;

  }catch(err){
    return err.message
  }

}

module.exports.postReaction = async (dataFromClient) =>{
  const { reaction,postId, user} = dataFromClient;
  try{
    const post = await users.Posts.findById(postId)

    if(reaction === "like"){
      // console.log("hii this is starting for like")
        const res = await post.updateOne({$push: {"postReactions.likes" : user}})
        const updatedpost = await users.Posts.findById(postId);
        const totallikes = await updatedpost.postReactions.likes.length
        return {updatedpost, totallikes}
    }
    if(reaction === "unlike"){
      // console.log("hii this is starting for unlike")
        const response = await post.updateOne({$pull : {"postReactions.likes": user}});
        const updatedpost = await users.Posts.findById(postId);
        const totallikes = await updatedpost.postReactions.likes.length
        return {updatedpost, totallikes}
    }
     if(reaction === "dislike"){
      // console.log("hii this is starting for dislike")
        const res = await post.updateOne({$push: {"postReactions.dislikes" : user}})
        const updatedpost = await users.Posts.findById(postId);
        const totalDislikes = await updatedpost.postReactions.dislikes.length
        return {updatedpost, totalDislikes}
    }
    if(reaction === "unDislike"){
      // console.log("hii this is starting for unDislike")
        const response = await post.updateOne({$pull : {"postReactions.dislikes": user}});
        const updatedpost = await users.Posts.findById(postId);
        const totalDislikes = await updatedpost.postReactions.dislikes.length
        return {updatedpost, totalDislikes}
    }
  }
  catch(err){
    return err.message
  }
}

module.exports.postComment =async (dataFromClient)=>{
    const {message, postId, user} = dataFromClient;
    try{
      const ownerOfComment = await users.User.findOne({username: user});
      const currentPost = await users.Posts.findByIdAndUpdate(postId,{$push: {comments: {_id: new Types.ObjectId(),message,ownerOfComment, createdAt: Date.now()}}});
      const updatedPost = await users.Posts.findById(postId);
      return updatedPost
    }
    catch(error){
      return error.message
    }
    
}

module.exports.getPostAllComments = async (dataFromClient) => {
    const {postId} = dataFromClient;
    try{
      const allComments = await users.Posts.findById(postId);
      return allComments.comments;
    }
    catch(err){
      return err;
    }
    
}

module.exports.getPostLikesDislikesCommentsValues = async (dataFromClient)=>{
  const {postId} = dataFromClient
  try{

    const currentPost = await users.Posts.findById(postId)
    const totalLikes = currentPost.postReactions.likes.length;
    const totalDislikes = currentPost.postReactions.dislikes.length;
    const totalComments = currentPost.comments.length;
    return {totalLikes,totalDislikes,totalComments}; 
    }
    catch(err){
      return err;
    }
}

module.exports.getAllNotifications = async (dataFromClient) => {
  const { loginUser } = dataFromClient;

  try{
    const AllNotifications = {
      allFriendRequests : []
    };
  
    //find the login user object
    const loginUserObject = await users.User.findOne({username: loginUser});
  
    //Get all friends requests notifications
    for(const key in loginUserObject.notifications.friendsRequest){
      const result = await users.User.findOne({username: loginUserObject.notifications.friendsRequest[key]});
      AllNotifications.allFriendRequests.push(result);
    }

    return AllNotifications;
  }
  catch(err){
    return err
  }
  
}

module.exports.acceptFriendRequest = async (dataFromClient) => {
  const { loginUser, friendWhoSentTheFriendRequest : friendUser} = dataFromClient;
  //loginUser = JO Friend Request accept kr rha hai
  //friendUser = JISNE Friend Request Beji hai
  //because this api is for accepting friend request
  try{
    const WhoAcceptingTheFriendRequest = await users.User.findOne({username: loginUser});
    const whoSendTheFriendRequest = await users.User.findOne({username: friendUser})
  
    await WhoAcceptingTheFriendRequest.updateOne({$pull : {"notifications.friendsRequest" : friendUser}})
    await WhoAcceptingTheFriendRequest.updateOne({$push: {friends: friendUser}})
    await whoSendTheFriendRequest.updateOne({$push:{friends: loginUser}})
    
    const loginPerson = await users.User.findOne({username: loginUser});
    const friendRequestSendPerson = await users.User.findOne({username: friendUser})
  
    return {loginPerson, friendRequestSendPerson};
  }
  catch(err){
    return {error: err}
  }
  
}
module.exports.getLoginUserAllInformation = async (dataFromClient) => {
  const { loginUser } = dataFromClient;
  try{
    const loginUserObject = await users.User.findOne({username: loginUser});
    const postCounts = await users.Posts.find({"user.username": loginUser}).count();

    const profileViews = loginUserObject.otherInformation.totalProfileViews;
    return {loginUserObject,postCounts,profileViews};
  }
  catch(err){
    return err
  }
}
module.exports.getProfileData = async (dataFromClient) => {
  const { profileUserUsername, loginUserUsername } = dataFromClient;
  try{

    const userObject = await users.User.findOne({username : profileUserUsername})
    if(profileUserUsername === loginUserUsername){
      return {userObject , isAccountOwner: true};
    }
    else{
      await users.User.findOneAndUpdate({username : loginUserUsername},{$inc : {"otherInformation.totalProfileViews": 1}},{new: true});
      return {userObject , isAccountOwner: false};
    }
  }
  catch(err){
    return err
  }
  
}

module.exports.updateProfileData = async (dataFromClient)=>{
  const {loginUser , coverImageLink, task, data} = dataFromClient;
  try{

    //for cover image
    if(task === "coverImageUpload"){
      const result = await users.User.findOneAndUpdate({username: loginUser},{$set : {coverImageUrl : coverImageLink}},{new: true})
      const loginUserAllPosts = await users.Posts.find({"user.username": loginUser})
      for(const key in loginUserAllPosts){
        await users.Posts.findByIdAndUpdate(loginUserAllPosts[key]._id,{$set : {"user.coverImageUrl": coverImageLink}})
      }
      return {coverImageLink: result.coverImageUrl};
    }
    //for profile image
    if(task === "profileImageUpload"){
      const result = await users.User.findOneAndUpdate({username: loginUser},{$set : {imageUrl : coverImageLink}},{new: true});
      const loginUserAllPosts = await users.Posts.find({"user.username": loginUser})
      for(const key in loginUserAllPosts){
        await users.Posts.findByIdAndUpdate(loginUserAllPosts[key]._id,{$set : {"user.imageUrl": coverImageLink}})
      }
      return {profileImageLink: result.imageUrl}
    }
    //for profile data updation
  
    if(task === "profileDataUpdate"){
      const response = await users.User.findOne({username: loginUser});
      const result = await users.User.findOneAndUpdate({username: loginUser},{$set:{
        firstName: data.inputFirstName,
        lastName: data.inputLastName,
        name: data.inputFirstName+" "+ data.inputLastName,
        "otherInformation.designation": data.inputDesignation,
        "otherInformation.website": data.inputWebsite,
        "otherInformation.gender": data.inputGender,
        "otherInformation.birthday": data.inputBirthday,
        "otherInformation.address.city": data.inputCity,
        "otherInformation.address.state": data.inputState,
        "otherInformation.address.zip": data.inputZip
      }},{new: true})
      return result;
    }
  }
  catch(err){
    return err
  }
  
  
}

module.exports.reportPost = async (dataFromClient) => {
  const { loginUser, reportedPostId } = dataFromClient;
  try{
    const result = await users.Posts.findById(reportedPostId)
    await result.updateOne({$push: {reports: loginUser}})
    const result2 = await users.Posts.findById(reportedPostId)
  
    return result2
  }
  catch(err){
    return err;
  }
  
}

module.exports.getAllReportedPosts = async (dataFromClient) => {
  const { page } = dataFromClient;
  try{
    const integerNumberOfPage = parseInt(page)
    const limit = 3;
    const firstIndex = (integerNumberOfPage-1)*limit;
    const lastIndex = integerNumberOfPage*limit;
    
    const allReportedPosts = await users.Posts.find({"reports.0" : { $exists : true } })
    const returningAllReportedPosts = allReportedPosts.slice(firstIndex,lastIndex)
  
    return returningAllReportedPosts;
  }
  catch(err){
    return err
  }
  
}

module.exports.deletePost = async (dataFromClient) => {
  const { postId } = dataFromClient;
  try{
    const deletedPost = await users.Posts.findByIdAndDelete(postId);
    return deletedPost;
  }
  catch(err){
    return err
  }
}

module.exports.approvePost = async (dataFromClient)=>{
  const { postId } = dataFromClient;
  try{
    const response = await users.Posts.findByIdAndUpdate(postId,{$set: {reports: []}},{new: true})
    return response
  }
  catch(err){
    return err;
  }
  
}

module.exports.getFilteredSuggestion = async (dataFromClient) => {
  const {loginUser, inputText} = dataFromClient;
  // all user suggestions

  try {
    const loginUserObject = await users.User.findOne({username: loginUser}); // 
    const allUsersArray = await users.User.find({});

    const newAllSuggestions = allUsersArray.filter(user => {
      if(user.username !== loginUserObject.username){
        if(loginUserObject.friends.length !== 0){
          for(const key in loginUserObject.friends){
              if(user.username !== loginUserObject.friends[key]){
                return user
              }
            }
        }
        else{
          return user
        }
      }
    }
    )
    //filtering the suggestions by input Text
    const filteredSuggestions = newAllSuggestions.filter((item)=>{
      return item.name.toLowerCase().includes(inputText.toLowerCase()) || item.username.toLowerCase().includes(inputText.toLowerCase())
    })

    return filteredSuggestions;
  } catch (error) {
    return error.message;
  }

  // return dataFromClient
}

module.exports.getFilteredFriends = async (dataFromClient) => {
  const {loginUser, inputText} = dataFromClient;
  
  try {

    //find the login user
    const response = await users.User.findOne({
      username: loginUser,
    });
    //getting all friends of login user

    const result = await response.friends.map(async (user) => {
      var new2 = await users.User.findOne({ username: user });
      return new2;
    });
    const filteredFriends =  Promise.all(result).then((res) => {
      var Myfriends = [];
      for (const key in res) {
        Myfriends.push(res[key]);
      }
      return Myfriends.filter((item)=>{
        return item.name.toLowerCase().includes(inputText.toLowerCase()) || item.username.toLowerCase().includes(inputText.toLowerCase())
      })
    });

    return filteredFriends;

  } catch (error) {
    return error.message;
  }
}
