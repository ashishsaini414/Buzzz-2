const initialUsersState = {
    mySuggestions: [],
    allFriends: [],
    allNotifications : [],
    loginUserInfo: {
        loginUserObject:{
            coverImageUrl: "",
            groups:[],
            recents: [],
            subscriptions: []
        }
    }
}
const userReducer = (state = initialUsersState, action) => {
    switch(action.type){

        case "SAVE_ALL_SUGGESTIONS":{
            return {...state, mySuggestions: [...action.payload]}
        }
        case "SAVE_ALL_FRIENDS": {
            return {...state, allFriends: [...action.payload]}
        }
        case "SAVE_LOGIN_USER_INFO" : {
            return {...state, loginUserInfo : action.payload}
        }
        case "ALL_NOTIFICATIONS":{
            //we will get all the users info. objects who sent the friend request to others
            return {...state, allNotifications: action.payload}
        }
        default: {
            return state
        } 
    }
}

export default userReducer;