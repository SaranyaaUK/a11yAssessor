/**
 * ForgotPasswordPage.jsx 
 * Component that represents the password reset page
 * 
 */

import React from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"
import ForgotPasswordBody from "../components/ForgotPasswordBody";


const ForgotPasswordPage = () => {
    return (
        <>
            <Header />
            <ForgotPasswordBody />
            <Footer />
        </>
    )
}

export default ForgotPasswordPage;