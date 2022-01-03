const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
    loginUserInfo: JSON.parse(localStorage.getItem("user")) || {
        imageUrl: "",
        username: "",
        name: ""
    },
    tokenDetails: JSON.parse(localStorage.getItem("tokenDetails")) || {}
}

const authReducer = (state = initialState, action) => {
        switch(action.type){
            case "SAVE_LOGIN_USER_DETAILS": {
                    localStorage.setItem("isLoggedIn",JSON.stringify(true))
                    localStorage.setItem("tokenDetails",JSON.stringify(action.payload.tokenDetails))
                    localStorage.setItem("user",JSON.stringify(action.payload.user));
                return {...state, isLoggedIn: true, loginUserInfo : action.payload.user, tokenDetails: action.payload.tokenDetails};
            }
            case "REMOVE_LOGIN_USER_DETAILS":{
                localStorage.clear()
                return {...state, isLoggedIn: false}
            }
            default: {
                return state
            }
        }
}
export default authReducer;