/**
 * 
 * SiteManualResultPage.jsx 
 * 
 * Component that represents the result page of manual evaluation
 * 
 */

import React from "react";
import Header from "../components/Header";
import ManualResultBody from "../components/ManualResultBody";
import Footer from "../components/Footer";

const SiteManualResultPage = (props) => {
    return (
        <div>
            <Header />
            <ManualResultBody />
            <Footer />
        </div >
    )
}

export default SiteManualResultPage;