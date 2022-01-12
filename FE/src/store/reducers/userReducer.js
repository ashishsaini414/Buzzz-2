const initialUsersState = {
    mySuggestions: [],
    myFilteredSuggestions: [],
    allFriends: [],
    allFilteredFriends: [],
    allNotifications : {
            allFriendRequests: []
    },
    loginUserInfo: {
        loginUserObject:{
            coverImageUrl: "",
            groups:[],
            recents: [],
            subscriptions: [],
            otherInformation: {
                designation: ""
            }
        }
    }
}
const userReducer = (state = initialUsersState, action) => {
    switch(action.type){

        case "SAVE_ALL_SUGGESTIONS":{
            return {...state, mySuggestions: [...action.payload], myFilteredSuggestions:[...action.payload]}
        }
        case "SAVE_ALL_FILTERED_SUGGESTIONS" : {
            return {...state, myFilteredSuggestions: [...action.payload]}
        }
        case "RESET_FILTERED_SUGGESTIONS" : {
            return {...state, myFilteredSuggestions: [...state.mySuggestions]}
        }
        case "SAVE_ALL_FRIENDS": {
            return {...state, allFriends: [...action.payload], allFilteredFriends: [...action.payload]}
        }
        case "SAVE_ALL_FILTERED_FRIENDS": {
            return {...state, allFilteredFriends: [...action.payload]}
        }
        case "RESET_FILTERED_FRIENDS": {
            return {...state, allFilteredFriends: [...state.allFriends]}
        }
        case "SAVE_LOGIN_USER_INFO" : {
            return {...state, loginUserInfo : action.payload}
        }
        case "REMOVE_FRIEND" : {
            state.allFilteredFriends.forEach((friend,index) =>{
                if(friend._id === action.payload._id){
                    state.allFilteredFriends.splice(index, 1)
                    state.myFilteredSuggestions.push(friend)
                }
            })
            return {...state, allFilteredFriends: [...state.allFilteredFriends], myFilteredSuggestions: [...state.myFilteredSuggestions]}
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