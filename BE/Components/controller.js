const users = require("./service")

module.exports.getAllSuggestions = async (req, res) => {
   const response =  await users.getAllSuggestions(req.body)
    res.send(JSON.stringify(response))
}
module.exports.createUser = async (req, res) => {
    const response =  await users.createUser(req.body)
     res.send(JSON.stringify(response))
 }
module.exports.getAllFriends = async(req, res) => {
    const response  = await users.getAllFriends(req.body)
    res.send(JSON.stringify(response))
}
module.exports.removeFriend = async(req, res) => {
    const response  = await users.removeFriend(req.body)
    res.send(JSON.stringify(response))
}

module.exports.addFriend = async(req, res) => {
    const response  = await users.addFriend(req.body)
    res.send(JSON.stringify(response))
}
module.exports.googleLogin = async (req, res)=>{
    const response = await users.googleLogin(req.body,res);
}
module.exports.createPost = async (req, res) => {
    const response = await users.createPost(req.body);
    res.send(JSON.stringify(response))
}
module.exports.getAllPosts = async (req, res) => {
    const response = await users.getAllPosts(req.body);
    res.send(JSON.stringify(response))
}
module.exports.postReaction = async (req, res)=>{
    const response  = await users.postReaction(req.body)
    res.send(JSON.stringify(response))
}
module.exports.postComment = async (req, res)=>{
    const response = await users.postComment(req.body)
    res.send(JSON.stringify(response))
}
module.exports.deleteComment = async (req, res) => {
    const response = await users.deleteComment(req.body, res);
}
module.exports.getPostAllComments = async (req, res)=>{
    const response = await users.getPostAllComments(req.body)
    res.send(JSON.stringify(response))
}   
module.exports.getPostLikesDislikesCommentsValues = async(req, res)=>{
    const response = await users.getPostLikesDislikesCommentsValues(req.body)
    res.send(JSON.stringify(response))
}
module.exports.getAllNotifications = async (req, res) => {
    const response = await users.getAllNotifications(req.body);
    res.send(JSON.stringify(response));
}
module.exports.acceptFriendRequest = async (req, res)=>{
    const response = await users.acceptFriendRequest(req.body)
    res.send(JSON.stringify(response))
}
module.exports.getLoginUserAllInformation = async (req, res) => {
    const response = await users.getLoginUserAllInformation(req.body);
    res.send(JSON.stringify(response))
}
module.exports.getProfileData = async (req, res) => {
    const response = await users.getProfileData(req.body);
    res.send(JSON.stringify(response));
}
module.exports.updateProfileData = async (req, res) => {
    const response =  await users.updateProfileData(req.body);
    res.send(JSON.stringify(response));
}
module.exports.reportPost = async (req, res) => {
    const response = await users.reportPost(req.body);
    res.send(JSON.stringify(response));
}
module.exports.getAllReportedPosts = async (req, res) => {
    const response  = await users.getAllReportedPosts(req.body);
    res.send(JSON.stringify(response));
}   
module.exports.deletePost = async (req, res) => {
    const response = await users.deletePost(req.body);
    res.send(JSON.stringify(response));
}
module.exports.approvePost = async (req, res) => {
    const response = await users.approvePost(req.body);
    res.send(JSON.stringify(response));
}
module.exports.getFilteredSuggestion = async (req, res) => {
    const response = await users.getFilteredSuggestion(req.body);
    res.send(JSON.stringify(response));
}
module.exports.getFilteredFriends = async (req, res) => {
    const response = await users.getFilteredFriends(req.body);
    res.send(JSON.stringify(response));
}


