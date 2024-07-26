/**
 * 
 * 
 *  HomePageBody.jsx
 * 
 *  Defines the content of the home page
 */

import React, { useState } from "react";
import { useNavigate, generatePath } from "react-router-dom";
// React-Bootstrap Components
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// Validation
import validator from "validator";
// Toasts
import { toast } from "react-toastify";

const HomePageBody = () => {
    // To redirect
    const navigate = useNavigate();
    // URL State
    const [url, setURL] = useState("");

    // Callbacks
    const onEvaluateBtnClick = async (e) => {
        e.preventDefault();

        // Validate the URL before proceeding
        const options = {
            protocols: ['http', 'https'],
            require_protocol: true,
            require_valid_protocol: true
        }
        if (!validator.isURL(url, options)) {
            toast.error("Enter a valid URL, in the form as shown in the URL input field");
            return;
        }

        const path = generatePath(`/:toPassURL`, {
            toPassURL: encodeURIComponent(url).toString()
        });

        // On evaluate button click take to the result page
        navigate(path);
    };

    return (
        <Container
            // Overlay background image
            className="p-1"
            style={{
                backgroundImage: `url('./a11yBg.png')`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: 65 + "vh",
                color: "white"
            }}
            fluid
        >
            <Container
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(250,0,0,0.2)"
                }}
                fluid
            >
                <InputGroup size="mb p-2" >
                    <InputGroup.Text>Enter the URL</InputGroup.Text>
                    <input type="url"
                        id="urlInput"
                        className="form-control"
                        value={url}
                        onChange={(e) => setURL(e.target.value)}
                        placeholder="https://www.example.com"
                        aria-label="Enter the URL of the webpage to evaluate"
                    />
                    <Button
                        type="submit"
                        onClick={onEvaluateBtnClick}
                    >
                        Evaluate
                    </Button>{' '}

                    {/* Tooltip for the info button */}
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 500 }}
                        overlay={
                            <Tooltip id="button-tooltip-2">
                                Only errors in the webpage are shown, <a href="/login">login</a> to view warnings, notices and do manual evaluation.
                            </Tooltip>
                        }
                    >
                        {({ ref, ...triggerHandler }) => (
                            <Button
                                variant="primary"
                                ref={ref}
                                {...triggerHandler}
                                className=" btn-sm rounded-pill m-1"
                                style={{
                                    width: 2 + "rem",
                                    height: 2 + "rem"
                                }}
                            >
                                <i className="fa-solid fa-circle-info"></i>
                            </Button>
                        )
                        }
                    </OverlayTrigger>
                </InputGroup>
            </Container >
        </Container >

    )
}

export default HomePageBody;