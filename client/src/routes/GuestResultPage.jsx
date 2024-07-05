/**
 * GuestResultPage.jsx 
 * Component that represents the result page for guest users
 * 
 */

import React from "react";
import { useParams } from "react-router-dom";

const GuestResult = () => {
    const { url } = useParams();

    return (
        <div>
            Result Page {decodeURIComponent(url)}
        </div>
    )
}

export default GuestResult;