import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TodoList from "./TodoList";
import { toggleTodo } from "../actions";
import { getVisibleTodos } from "../reducers";

const mapStateTodoListToProps = (state, ownProps) => ({
  todos: getVisibleTodos(state, ownProps.match.params.filter || 'all')
});
/* const mapDispatchTodoListToProps = dispatch => ({
  onTodoClick(id) {
    dispatch(toggleTodo(id));
  }
}); */
const VisibleTodoList = withRouter(
  connect(
    mapStateTodoListToProps,
    { onTodoClick: toggleTodo }
  )(TodoList)
);

export default VisibleTodoList;
