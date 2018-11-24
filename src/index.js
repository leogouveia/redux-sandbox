import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import TodoApp from "./TodoApp";
import todoApp from "./Reducers";

const persistedState = {
  todos: [{
    id: '0',
    text: 'Welcome Back!',
    completed: false
  }]
};

const store = createStore(todoApp, persistedState);
console.log('state', store.getState());

ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);
