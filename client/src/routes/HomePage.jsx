/**
 * 
 * HomePage.jsx 
 * Component that represents the home page
 * 
 */

import React from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"
import HomePageBody from "../components/HomePageBody";

const Home = () => {
    return (
        <div>
            <Header />
            <HomePageBody />
            <Footer />
        </div>
    )
}

export default Home;