import React, { Component } from "react";
import ReactDOM from "react-dom";
import { combineReducers, createStore } from "redux";
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
const store = createStore(todoApp);

//#region Presentational Components
const FilterLink = ({ filter, currentFilter, children, onClick }) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClick(filter)
      }}
    >
      {children}
    </a>
  );
};

const Footer = ({ visibilityFilter, onFilterClick }) => {
  return (
    <p>
      Show: &nbsp;
      <FilterLink currentFilter={visibilityFilter} filter="SHOW_ALL" onClick={onFilterClick}>
        All
      </FilterLink>
      {" | "}
      <FilterLink currentFilter={visibilityFilter} filter="SHOW_ACTIVE" onClick={onFilterClick}>
        Active
      </FilterLink>
      {" | "}
      <FilterLink currentFilter={visibilityFilter} filter="SHOW_COMPLETED" onClick={onFilterClick}>
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

const AddTodo = ({ onAddClick }) => {
  let input;
  return (
    <div>
      <input ref={node => (input = node)} />
      <button
        onClick={() => {
          onAddClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};
//#endregion Presentational Components

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
let nextTodoId = 0;

//Container Component
class TodoApp extends Component {
  handleTodoClick = (id) => {
    store.dispatch({
      type: "TOGGLE_TODO",
      id
    });
  };
  handleAddClick = (text) => {
    store.dispatch({
      type: "ADD_TODO",
      text,
      id: nextTodoId++
    });
  };
  handleFilterClick = (filter) => {
    store.dispatch({
      type: "SET_VISIBILITY_FILTER",
      filter
    });
  };
  render() {
    const { todos, visibilityFilter } = this.props;
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);
    return (
      <div>
        <AddTodo onAddClick={text => this.handleAddClick(text)} />
        <TodoList
          todos={visibleTodos}
          onTodoClick={id => this.handleTodoClick(id)}
        />
        <Footer visibilityFilter={visibilityFilter} onFilterClick={this.handleFilterClick}/>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    document.getElementById("root")
  );
};
store.subscribe(render);
render();
