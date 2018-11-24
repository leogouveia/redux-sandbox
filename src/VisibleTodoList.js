import React from "react";
import { connect } from 'react-redux';
import Todo from './Todo';
import { toggleTodo } from "./Actions";

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo => (
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    ))}
  </ul>
);

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

const mapStateTodoListToProps = state =>  ({
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  });

const mapDispatchTodoListToProps = dispatch => ({
    onTodoClick(id) {
      dispatch(toggleTodo(id));
  }
});
const VisibleTodoList = connect(
  mapStateTodoListToProps,
  mapDispatchTodoListToProps
)(TodoList);

export default VisibleTodoList;