import { createStore, applyMiddleware } from "redux";
import todoApp from "./reducers";
import { createLogger } from 'redux-logger'
import promiseMiddleware from "redux-promise";

const configureStore = () => {
  const middlewares = [promiseMiddleware];
  if (process.env.NODE_ENV !== "production") {
    middlewares.push(createLogger());
  }
  return createStore(todoApp, applyMiddleware(...middlewares));
};

export default configureStore;
