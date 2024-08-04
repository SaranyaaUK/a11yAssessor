/**
 * SiteDashboardPage.jsx 
 * 
 * Component that represents the SiteDashboard Page
 * 
 */

import React from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"
import SiteDashboardBody from "../components/SiteDashboardBody";


const SiteDashboardPage = () => {
    return (
        <>
            <Header />
            <SiteDashboardBody />
            <Footer />
        </>
    )
}

export default SiteDashboardPage;