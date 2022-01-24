import React, { useState } from "react";
import { Route, Routes, BrowserRouter} from "react-router-dom";
import "./App.css";
import AjaxApi from "./components/AjaxApi";
import Header from "./components/header";
import BarNav from "./components/navegation";

function App() {
  const url = [
    "https://pokeapi.co/api/v2/pokemon/?limit=151&offset=0",
    "https://pokeapi.co/api/v2/pokemon/?limit=100&offset=151",
    "https://pokeapi.co/api/v2/pokemon/?limit=135&offset=251",
    "https://pokeapi.co/api/v2/pokemon/?limit=107&offset=386",
    "https://pokeapi.co/api/v2/pokemon/?limit=156&offset=493",
    "https://pokeapi.co/api/v2/pokemon/?limit=72&offset=649",
    "https://pokeapi.co/api/v2/pokemon/?limit=88&offset=721",
    "https://pokeapi.co/api/v2/pokemon/?limit=89&offset=809"
  ];

  return (
    <>
      <Header/>
      <BarNav/>
      <div className="App">
        <Routes>
          <Route path="/" element={<Header/>} />
          <Route path="/first_gen" element={<AjaxApi urlApi={url[0]} />} />
          <Route path="/second_gen" element={<AjaxApi urlApi={url[1]} />} />
          <Route path="/third_gen" element={<AjaxApi urlApi={url[2]} />} />
          <Route path="/fourth_gen" element={<AjaxApi urlApi={url[3]} />} />
          <Route path="/fifth_gen" element={<AjaxApi urlApi={url[4]} />} />
          <Route path="/sixth_gen" element={<AjaxApi urlApi={url[5]} />} />
          <Route path="/seventh_gen" element={<AjaxApi urlApi={url[6]} />} />
          <Route path="/eighth_gen" element={<AjaxApi urlApi={url[7]} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
