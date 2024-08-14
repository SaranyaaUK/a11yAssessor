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
                const response = await ServerAPI.get(`/automated/results/${location.state.site_id}`,
                    {
                        headers: {
                            "token": localStorage.getItem("token"),
                        }
                    }
                );
                // Rearrange the result as errors, warnings and notices
                const data = {
                    groupedErrors: {},
                    groupedWarnings: {},
                    groupedNotices: {}
                };

                response.data.result.issues.forEach(element => {
                    const groupKey = element.code;

                    if (element.typeCode === 1) {
                        if (!data.groupedErrors[groupKey]) {
                            data.groupedErrors[groupKey] = [];
                        }
                        data.groupedErrors[groupKey].push(element);
                    } else if (element.typeCode === 2) {
                        if (!data.groupedWarnings[groupKey]) {
                            data.groupedWarnings[groupKey] = [];
                        }
                        data.groupedWarnings[groupKey].push(element);
                    } else if (element.typeCode === 3) {
                        if (!data.groupedNotices[groupKey]) {
                            data.groupedNotices[groupKey] = [];
                        }
                        data.groupedNotices[groupKey].push(element);
                    }
                });

                // Return the group result
                setResults(data);
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
            {(isResultsReady) ? (<ResultPageBody url={decodeURIComponent(location.state.url)} results={results} siteid={location.state.site_id} />) : (<Loading />)}
            <Footer />
        </ >
    )
}

export default SiteAutomatedResultPage;