/**
 * RegisterPage.jsx 
 * Component that represents the home page
 * 
 */

import React from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"
import RegisterPageBody from "../components/RegisterPageBody";


const RegisterPage = () => {
    return (
        <>
            <Header />
            <RegisterPageBody />
            <Footer />
        </>
    )
}

export default RegisterPage;