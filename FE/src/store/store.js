import {createStore} from 'redux';
import rootReducer from './rootReducers';
import mymiddleware from './middlewares/middleware'
import { composeWithDevTools } from 'redux-devtools-extension';
const store = createStore(rootReducer, composeWithDevTools(mymiddleware))

export default store;