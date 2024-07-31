/**
 * LoginPage.jsx 
 * Component that represents the home page
 * 
 */

import React from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"
import LoginPageBody from "../components/LoginPageBody";


const LoginPage = () => {
    return (
        <>
            <Header />
            <LoginPageBody />
            <Footer />
        </>
    )
}

export default LoginPage;