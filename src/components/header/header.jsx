import React from "react";
import "./header.css";
import { Outlet } from "react-router";
import {NavBar} from "./Nav/navigation";
import {NavTypes} from "./Nav/navigation types";

export function Header() {
    return (
      <div className="banner">
        <header>
        <img src="https://rajgaurav99.github.io/PokeCards-WEB/images/banner.png" alt="Pokemon Baner" />
        </header>
        <NavBar/>
        <NavTypes/>
        <>
        <Outlet/>
        </>
      </div>
    );
  }
;