
const initialState = {
    allposts: [],
    postComments: [],
    reportedPosts: []
}
const postReducer = (state = initialState,action) => {
    switch(action.type){
        case "ADD_NEW_POSTS" : {
            // console.log(action.payload)
            return {...state, allposts: [...state.allposts, ...action.payload]}
        }
        case "UPDATE_NEW_POST":{
            // console.log(action.payload);
            return {...state, allposts: [action.payload, ...state.allposts]}
        }
        case "LOAD_POST_COMMENTS":{
            return {...state, postComments: [...action.payload]}
        }
        case "POST_SORT_BY_BOTTOM" : {
            const newArrayForAllPosts = []
            const newArrayForAllReportedPosts = []

            state.allposts.forEach((item) => {
                newArrayForAllPosts.unshift(item);
            })
            state.reportedPosts.forEach((item)=>{
                newArrayForAllReportedPosts.unshift(item)
            })
            return {...state, allposts : [ ...newArrayForAllPosts ], reportedPosts: [...newArrayForAllReportedPosts]}
        }
        case "POST_SORT_BY_TOP" : {
            const newArrayForAllPosts = []
            const newArrayForAllReportedPosts = []
            
            state.allposts.forEach((item) => {
                newArrayForAllPosts.unshift(item);
            })
            state.reportedPosts.forEach((item) => {
                newArrayForAllReportedPosts.unshift(item);
            })
            return {...state, allposts : [ ...newArrayForAllPosts ], reportedPosts: [...newArrayForAllReportedPosts]}
        }
        case "SAVE_REPOTED_POST" : {
            return {...state, reportedPosts: [...state.reportedPosts, ...action.payload]}
        }
        case "REMOVE_POST" :{
            state.allposts.forEach((post,index) =>{
                if(post._id === action.payload){
                    state.allposts.splice(index, 1)
                }
            })
            state.reportedPosts.forEach((post,index) =>{
                if(post._id === action.payload){
                    state.reportedPosts.splice(index, 1)
                }
            })
            return {...state, allposts: [...state.allposts],reportedPosts: [...state.reportedPosts]}
        }
        case "DELETE_ALL_SAVED_POSTS" : {
            state.allposts.length = 0;
            return state
        }
        case "DELETE_ALL_SAVED_REPORTED_POSTS" :{
            state.reportedPosts.length = 0;
            return state;
        }
        default: {
            return state
        }
    }
}

export default postReducer;