/**
 * EmailVerifyPage.jsx 
 * Component that represents the home page
 * 
 */

import React from "react";
import { generatePath, useNavigate, useLocation } from "react-router-dom";
import ServerAPI from "../apis/ServerAPI";
import Header from "../components/Header"
import Footer from "../components/Footer"
// Notification
import { toast } from "react-toastify";


const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const fetchResult = async () => {
        try {
            const params = location.pathname.split("/");
            // Make request to authenticate the user
            const response = await ServerAPI.get(`/auth/activate/${params[2]}/${params[3]}`);

            if (response.data.success) {
                // Navigate to login page after email verification
                navigate(generatePath("/login"), { replace: true, state: { "message": "Email verified" } });
                toast.success("Email verified!", { position: "top-center" });
            } else {
                toast.error(response.data.message, { position: "top-center" });
            }
        } catch (err) {
            toast.error("Email not verified!", { position: "top-center" });
        }
    }

    fetchResult()
    return (
        <>
            <Header />
            <h1 className="display-2">Email Verified!</h1>
            <Footer />
        </>
    )
}

export default VerifyEmailPage;