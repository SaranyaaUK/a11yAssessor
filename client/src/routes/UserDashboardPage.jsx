/**
 * 
 * UserDashboardPage.jsx
 * 
 * Component that represents the user dashboard page
 * 
 */

import React from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"
import UserDashboardBody from "../components/UserDashboardBody";


const Home = () => {
    return (
        <>
            <Header />
            <UserDashboardBody />
            <Footer />
        </>
    )
}

export default Home;