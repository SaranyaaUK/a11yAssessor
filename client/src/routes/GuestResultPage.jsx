/**
 * GuestResultPage.jsx
 * 
 * Component that represents the result page for guest users
 * 
 */

import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
// Components
import Header from "../components/Header";
import ResultPageBody from "../components/ResultPageBody";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
// API
import ServerAPI from "../apis/ServerAPI";
// Toasts
import { toast } from "react-toastify";

const GuestResult = (props) => {
    const { results, setResults } = useContext(AppContext);
    const { url } = useParams();

    const isResultsReady = Object.keys(results).length !== 0;

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setResults([]);
                const response = await ServerAPI.get(`/${encodeURIComponent(url)}`);
                // Rearrange the result as errors, warnings and notices
                const data = {
                    groupedErrors: {},
                    groupedWarnings: {},
                    groupedNotices: {}
                };

                response.data.issues.forEach(element => {
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
                toast.error("Cannot retrieve the results, try again!");
            }
        }
        fetchResult();
    }, [url, setResults]) // Empty dependency array - UseEffect hook will only run when the component mounts 

    return (
        <>
            <Header />
            {(isResultsReady && url) ? (<ResultPageBody url={url} results={results} />) : (<Loading />)}
            <Footer />
        </>
    )
}

export default GuestResult;