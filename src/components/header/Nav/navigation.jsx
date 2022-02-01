import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./navigation.css";

export function NavBar() {
  const [display, setDisplay] = useState("")

  const onShow= ()=>{
    if(display==="none"){
    display.slice(0);
    setDisplay("flex")}
    else{display.slice(0);
      setDisplay("none")}
  }

  return (
    <>
    <button onClick={onShow}>List Generation</button>
      <ul style={{display:display}}>
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
          <Link to="/alternative_forms" onClick={onShow}>Alternative Forms</Link>
        </li>
      </ul>
    </>
  );
};
