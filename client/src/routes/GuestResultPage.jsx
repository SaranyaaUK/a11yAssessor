/**
 * GuestResultPage.jsx 
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
                setResults(response.data);
            } catch (err) {
                toast.error("Cannot retrieve the results, try again!");
            }
        }
        fetchResult();
    }, [url, setResults]) // Empty dependency array - UseEffect hook will only run when the component mounts 

    return (
        <div>
            <Header />
            {(isResultsReady && url) ? (<ResultPageBody url={url} results={results} />) : (<Loading />)}
            <Footer />
        </div >
    )
}

export default GuestResult;