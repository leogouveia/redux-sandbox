import { combineReducers } from "redux";

const createList = filter => {
  const handleToggleTodo = (state, response) => {
    const { result: id, entities } = response;
    const todo = entities.todos[id];
    const shouldRemove = (
      (todo.completed && filter === 'active') ||
      (!todo.completed && filter === 'completed')
    );
    return shouldRemove
              ? state.filter(id => id !== todo.id)
              : state;
  }
  const ids = (state = [], action) => {
    switch (action.type) {
      case "FETCH_TODOS_SUCCESS":
        return filter === action.filter
          ? action.response.result
          : state;
      case "ADD_TODO_SUCCESS":
        return filter !== "completed" 
            ? [...state, action.response.result]
            : state;
      case "TOGGLE_TODO_SUCCESS":
        return handleToggleTodo(state, action.response)
      default:
        return state;
    }
  };
  const isFetching = (state = false, action) => {
    if (action.filter !== filter) return state;
    switch (action.type) {
      case "FETCH_TODOS_REQUEST":
        return true;
      case "FETCH_TODOS_FAILURE":
      case "FETCH_TODOS_SUCCESS":
        return false;
      default:
        return state;
    }
  };
  const errorMessage = (state = null, action) => {
    if (filter !== action.filter) {
      return state;
    }
    switch (action.type) {
      case "FETCH_TODOS_FAILURE":
        return action.message;
      case "FETCH_TODOS_REQUEST":
      case "FETCH_TODOS_SUCCESS":
        return null;
      default:
        return state;
    }
  };
  return combineReducers({ ids, isFetching, errorMessage });
};

export default createList;

export const getIds = state => state.ids;
export const getIsFetching = state => state.isFetching;
export const getErrorMessage = state => state.errorMessage;
