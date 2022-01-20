import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./navegation.css";



function NavBar() {
    let limitGen=890;
    let outSetGen=0;
    let limitGens=[151,100,135,107,156,72,88,89];
    let outSetGens=[0,151,251,386,493,649,721,809];
    let filterGen = a=>{ limitGen=limitGens[a]; outSetGen=outSetGens[a];
        console.log(limitGen, outSetGen)};

    console.log(limitGen, outSetGen)
    return (
        <>
            <ul>
                <li>
                    <Link to="/first_gen" onClick={filterGen(0)}>First Gen</Link>
                </li>
                <li>
                    <Link to="/second_gen" onClick={filterGen(1)}>Second Gen</Link>
                </li>
                <li>
                    <Link to="/third_gen" onClick={filterGen(2)}>Third Gen</Link>
                </li>
                <li>
                    <Link to="/fourth_gen" onClick={filterGen(3)}>Fourth Gen</Link>
                </li>
                <li>
                    <Link to="/fifth_gen" onClick={filterGen(4)}>Fifth Gen</Link>
                </li>
                <li>
                    <Link to="/sixth_gen" onClick={filterGen(5)}>Sixth Gen</Link>
                </li>
                <li>
                    <Link to="/seventh_gen" onClick={filterGen(6)}>Seventh Gen</Link>
                </li>
                <li>
                    <Link to="/eighth_gen" onClick={filterGen(7)}>Eighth Gen</Link>
                </li>
            </ul>
        </>
    );
}
export default NavBar;

