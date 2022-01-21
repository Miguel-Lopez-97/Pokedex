import React, { Component } from "react";
import "./App.css";
import AjaxApi from "./components/AjaxApi";
import Header from "./components/header";
import BarNav from  "./components/navegation"

function App() {
  return (
    <>
      <Header></Header>
      <BarNav></BarNav>
      <div className="App">
        <AjaxApi>
        </AjaxApi>
      </div>
    </>
  );
}

export default App;
