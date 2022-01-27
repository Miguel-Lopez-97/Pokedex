import React from "react";
import "./header.css";
import { Outlet } from "react-router";
import NavBar from "./Nav/navegation";
import NavTypes from "./Nav/navegation types";

function Header() {
    return (
      <>
      <header>
      <img src="https://cdn.atomix.vg/wp-content/uploads/2014/09/PokemonCompany.png" alt="Pokemon Baner" />
      </header>
      <NavBar/>
      <NavTypes/>
      <>
      <Outlet/>
      </>
      </>
    );
  }
  
  export default Header;