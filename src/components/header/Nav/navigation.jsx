import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./navigation.css";

export function NavBar() {
  const [displayGen, setDisplayGen] = useState()

  const [display, setDisplay] = useState("none")

  const onShow = () => {
    if (window.screen.width < 780) {
      if (display === "none") {
        display.slice(0);
        setDisplay("flex")
      }
      else {
        display.slice(0);
        setDisplay("none")
      }
    }
    else { setDisplay("flex") }
  };

  const onShowFirst = () => {
    if (window.screen.width < 780) {
      setDisplayGen("none")
    }
    else { setDisplayGen("flex") }
  }
    ;

  useEffect(() => { onShowFirst(); },
  );

  return (
    <>
      <button onClick={onShow}>List Generation</button>
      <ul style={{ display: displayGen === "none" ? display : displayGen }}>
        <li>
          <Link to="/" onClick={onShow}>Home</Link>
        </li>
        <li>
          <Link to="/first_gen" onClick={onShow}>First Gen</Link>
        </li>
        <li>
          <Link to="/second_gen" onClick={onShow}>Second Gen</Link>
        </li>
        <li>
          <Link to="/third_gen" onClick={onShow}>Third Gen</Link>
        </li>
        <li>
          <Link to="/fourth_gen" onClick={onShow}>Fourth Gen</Link>
        </li>
        <li>
          <Link to="/fifth_gen" onClick={onShow}>Fifth Gen</Link>
        </li>
        <li>
          <Link to="/sixth_gen" onClick={onShow}>Sixth Gen</Link>
        </li>
        <li>
          <Link to="/seventh_gen" onClick={onShow}>Seventh Gen</Link>
        </li>
        <li>
          <Link to="/eighth_gen" onClick={onShow}>Eighth Gen</Link>
        </li>
        <li>
          <Link to="/ninth_gen" onClick={onShow}>Ninth Gen</Link>
        </li>
        <li>
          <NavLink to="/alternative_forms" className="nav-link" activeClassName="active" onClick={onShow}>
            Alternative Forms
          </NavLink>
        </li>
        <li>
          <NavLink to="/trivia" className="nav-link" activeClassName="active" onClick={onShow}>
            Trivia Game
          </NavLink>
        </li>
      </ul>
    </>
  );
};
