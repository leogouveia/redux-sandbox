import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const FilterLink = ({ filter, children }) => (
  <NavLink
    exact
    to={filter === "all" ? "/" : `/${filter}`}
    activeStyle={{
      textDecoration: "none",
      color: "#000"
    }}
  >
    {children}
  </NavLink>
);
FilterLink.propTypes = {
  filter: PropTypes.oneOf(["all", "completed", "active"]).isRequired,
  children: PropTypes.node.isRequired
};

export default FilterLink;
