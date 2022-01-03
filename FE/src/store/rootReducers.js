import {combineReducers} from 'redux';
import authReducer from './reducers/authReducer';
import postReducer from './reducers/postReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
    users: userReducer,
    posts: postReducer,
    auth: authReducer
})

export default rootReducer;