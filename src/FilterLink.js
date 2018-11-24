import React from 'react';
import { connect } from 'react-redux';
import { filterTodo } from './Actions';

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

const mapStateLinkToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

const mapDispatchLinkToProps = (dispatch, ownProps) => {
  return {
    onClick() {
      dispatch(filterTodo(ownProps.filter));
    }
  };
};

const FilterLink = connect(
  mapStateLinkToProps,
  mapDispatchLinkToProps
)(Link);

export default FilterLink;