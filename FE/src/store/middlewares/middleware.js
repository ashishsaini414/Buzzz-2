import { applyMiddleware } from "redux";

const logger = store => next => action => {
    console.log(action.type + " is fired")
    next(action)
}

const mymiddleware = applyMiddleware(logger)

export default mymiddleware