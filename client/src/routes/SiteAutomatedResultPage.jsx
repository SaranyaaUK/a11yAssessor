/**
 * SiteAutomatedResultPage.jsx 
 * 
 * Component that represents the result page for authorised users
 * 
 */

import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
// Context
import { AppContext } from "../context/AppContext";
// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import ResultPageBody from "../components/ResultPageBody";
// API
import ServerAPI from "../apis/ServerAPI";

const SiteAutomatedResultPage = (props) => {

    const { results, setResults } = useContext(AppContext);
    const location = useLocation();

    const isResultsReady = Object.keys(results).length !== 0;
    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await ServerAPI.get(`/results/automated/${location.state.site_id}`,
                    {
                        headers: {
                            "token": localStorage.getItem("token"),
                        }
                    }
                );
                setResults(response.data.result);
            } catch (err) {
                console.log(err);
            }
        }
        fetchResult();
    }, [setResults, location])

    // Render the component
    return (
        <>
            <Header />
            {(isResultsReady) ? (<ResultPageBody url={decodeURIComponent(location.state.url)} results={results} />) : (<Loading />)}
            <Footer />
        </ >
    )
}

export default SiteAutomatedResultPage;