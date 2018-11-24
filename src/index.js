import React, { Component } from "react";
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";
import { combineReducers, createStore } from "redux";
import { Provider, connect } from "react-redux";

const todo = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};
const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];
    case "TOGGLE_TODO":
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};
const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

//#region Presentational Components
const Link =({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }} >
        {children}
      </a>
  );
};

const Footer = () => {
  return (
    <p>
      Show: &nbsp;
      <FilterLink filter="SHOW_ALL">
        All
      </FilterLink>
      {" | "}
      <FilterLink filter="SHOW_ACTIVE">
        Active
      </FilterLink>
      {" | "}
      <FilterLink filter="SHOW_COMPLETED">
        Completed
      </FilterLink>
    </p>
  );
};

const Todo = ({ onClick, completed, text }) => {
  return (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? "line-through" : "none",
        cursor: "pointer"
      }}
    >
      {text}
    </li>
  );
};

const TodoList = ({ todos, onTodoClick }) => {
  return (
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
      ))}
    </ul>
  );
};


let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input ref={node => (input = node)} />
      <button
        onClick={() => {
          dispatch({
            type: "ADD_TODO",
            text: input.value,
            id: nextTodoId++
          });
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

//#endregion Presentational Components

//Container Component
const mapStateFilterLinkToProps = (state) => {
  return {
    filter: state.visibilityFilter,

  }
}
const mapDispatchFilterLinkToProps = (dispatch) => {
  return {
    onClick: (filter) => 
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: filter
      })
  }
}
class FilterLink extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <Link
        active={ props.filter === state.visibilityFilter }
        onClick={(filter) => 
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }> {props.children} </Link>
    );
  }
}
FilterLink.contextTypes = {
store: PropTypes.object
}

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter(t => t.completed);
    case "SHOW_ACTIVE":
      return todos.filter(t => !t.completed);
    default:
      return todos;
  }
};

const mapStateTodoListToProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  }
}

const mapDispatchTodoListToProps = (dispatch) => {
  return {
    onTodoClick: id => 
      dispatch({
        type: "TOGGLE_TODO",
        id
      })
  }
}
const VisibleTodoList = connect(
  mapStateTodoListToProps,
  mapDispatchTodoListToProps
)(TodoList);

let nextTodoId = 0;
const TodoApp = () => (
   <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
);

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);