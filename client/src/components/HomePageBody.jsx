/**
 * 
 * 
 *  HomePageBody.jsx
 * 
 *  Defines the content of the home page
 */

import React, { useState } from "react";
import { useNavigate, generatePath } from "react-router-dom";


const HomePageBody = () => {
    const [url, setURL] = useState("");
    const navigate = useNavigate();

    const handleForm = async (e) => {
        e.preventDefault();
        console.log(encodeURIComponent(url));
        const path = generatePath(`/:toPassURL`, {
            toPassURL: encodeURIComponent(url).toString()
        });
        navigate(path);
    };

    return (
        <div
            className="bg-image position-relative"
            style={{
                backgroundImage: `url('./homePageBg.png')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: 65 + "vh",
                color: "white"
            }}>
            {/* // style={{
            //     backgroundImage: `url('./a11y.png')`,
            //     backgroundSize: "cover",
            //     backgroundRepeat: "no-repeat",
            //     backgroundPosition: "center",
            //     height: 65 + "vh",
            //     color: "white"
            // }}> */}
            < div className="position-absolute mask d-flex justify-content-sm-center align-items-center" style={{
                height: "100%",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.8)"

            }}>
                <form onSubmit={handleForm}>
                    <div className="row g-3 justify-content-sm-center align-items-center">
                        <div className="col-sm-2 m-1">
                            <label className="col-form-label" htmlFor="urlInput">Enter the URL:</label>
                            <button className="btn btn-sm btn-outline-primary rounded-pill m-1"
                                style={{
                                    width: 2 + "rem",
                                    height: 2 + "rem"
                                }}
                                data-bs-toggle="popover"
                                data-bs-trigger="focus"
                                data-bs-title="Info"
                                data-bs-content="Only Errors will be shown"
                            ><i className="fa-solid fa-circle-info"></i>
                            </button>
                        </div>
                        <div className="col-sm-8 m-1">
                            <input type="url" id="urlInput"
                                className="form-control" value={url}
                                onChange={(e) => setURL(e.target.value)} placeholder="https://www.example.com/" aria-label="Webpage URL" />
                        </div>
                        <div className="col-sm-1 m-1"><button type="submit" className="btn btn-outline-primary">Evaluate</button></div>
                    </div>
                </form >
            </div>
        </div >
    )
}

export default HomePageBody;