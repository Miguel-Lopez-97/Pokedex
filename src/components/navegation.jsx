import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./navegation.css";

function NavBar() {
  
  return (
    <>
      <ul>
      <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/first_gen">First Gen</Link>
        </li>
        <li>
          <Link to="/second_gen">Second Gen</Link>
        </li>
        <li>
          <Link to="/third_gen">Third Gen</Link>
        </li>
        <li>
          <Link to="/fourth_gen">Fourth Gen</Link>
        </li>
        <li>
          <Link to="/fifth_gen">Fifth Gen</Link>
        </li>
        <li>
          <Link to="/sixth_gen">Sixth Gen</Link>
        </li>
        <li>
          <Link to="/seventh_gen">Seventh Gen</Link>
        </li>
        <li>
          <Link to="/eighth_gen">Eighth Gen</Link>
        </li>
      </ul>
    </>
  );
}
export default NavBar;
