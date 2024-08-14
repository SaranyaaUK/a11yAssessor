/**
 * 
 * AboutPage.jsx
 * 
 * Component that represents the about us page
 * 
 */

import React from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"
import AboutUsBody from "../components/AboutUsBody";

const AboutPage = () => {
    return (
        <>
            <Header />
            <AboutUsBody />
            <Footer />
        </>
    )
}

export default AboutPage;