/**
 * SiteManualEvaluationPage.jsx
 * 
 * Component that represents the evaluation form for guided evaluation
 * 
 */

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ManualEvaluationForm from "../components/ManualEvaluationForm"

const SiteManualEvaluationPage = () => {
    return (
        <div>
            <Header />
            <ManualEvaluationForm />
            <Footer />
        </div >
    )
}

export default SiteManualEvaluationPage;