/**
 * 
 *  ResultPageBody.jsx
 * 
 *  The component renders the body of the guest result page
 * 
 */
import React, { useContext } from "react";
import { useNavigate, generatePath } from "react-router-dom";
// React-Bootstrap Components
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Ratio from 'react-bootstrap/Ratio';
import ResultAccordion from "./ResultAccordion";
import Row from "react-bootstrap/Row";
import Stack from 'react-bootstrap/Stack';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Tooltip from "react-bootstrap/Tooltip";
// Context
import { AuthenticationContext } from "../context/AppContext";


const ResultPageBody = ({ url, results, siteid }) => {
    const navigate = useNavigate();
    // Authentication Context
    const { isAuthenticated } = useContext(AuthenticationContext);

    const errorsPresent = Object.keys(results.groupedErrors).length !== 0;
    const warningsPresent = Object.keys(results.groupedWarnings).length !== 0;
    const noticesPresent = Object.keys(results.groupedNotices).length !== 0;

    // Callback - Home button 
    const onHomeBtnClick = (e) => {
        e.preventDefault();
        navigate(generatePath("/dashboard"));
    }

    // Callback - Site Home button 
    const onSiteHomeBtnClick = (e) => {
        e.preventDefault();
        navigate(generatePath(`/dashboard/${siteid}`));
    }

    // Render the component
    return (
        <Container className="px-5 py-3" fluid >
            <Row className="p-2">
                <Stack direction="horizontal" gap={5}>
                    <h1 className="display-4"> Results </h1>
                    {/* For navigation to user dashboard or site dashboard */}
                    {
                        (isAuthenticated) ? (<ButtonToolbar aria-label="Toolbar with button groups" className="ms-auto">
                            <ButtonGroup className="m-2">
                                <Button size="sm" onClick={(e) => onHomeBtnClick(e)}>
                                    <Stack direction="horizontal" gap={2}>
                                        <i className="fa-solid fa-house" />
                                        <>Home</>
                                    </Stack>
                                </Button>
                                <Button size="sm" onClick={(e) => onSiteHomeBtnClick(e)}>
                                    <Stack direction="horizontal" gap={2}>
                                        <i className="fa-solid fa-file-export" />
                                        <>Site Home</>
                                    </Stack>
                                </Button>
                            </ButtonGroup>
                        </ButtonToolbar>) : (<></>)
                    }
                </Stack>
            </Row>

            <Row>
                <Col>
                    <Tabs
                        defaultActiveKey={0}
                        transition={false}
                        id="guest-result-tab"
                        className="mb-3">
                        <Tab eventKey={0} title="Errors">
                            {/* Display errors if present */}
                            {
                                (!errorsPresent) ?
                                    (<h2>No errors found</h2>) :
                                    (<ResultAccordion url={url} groupedResults={results.groupedErrors} />)
                            }
                        </Tab>

                        <Tab eventKey={1} title="Warnings">
                            {/* Display warnings if present and user is authenticated */}
                            {
                                (isAuthenticated) ?
                                    ((!warningsPresent) ?
                                        (<h2 className="d-flex justify-content-center align-items-center">No Warnings found</h2>) :
                                        (<ResultAccordion url={url} groupedResults={results.groupedWarnings} />)) :
                                    (<h2 className="text-center"><a href="/login">Login</a> to view warnings</h2>)

                            }
                        </Tab>

                        <Tab eventKey={2} title="Notices">
                            {/* Display notices if present and user is authenticated */}
                            {
                                (isAuthenticated) ?
                                    ((!noticesPresent) ?
                                        (<h2 className="d-flex justify-content-center align-items-center">No Notices found</h2>) :
                                        (<ResultAccordion url={url} groupedResults={results.groupedNotices} />)) :
                                    (<h2 className="text-center"><a href="/login">Login</a> to view notices</h2>)
                            }
                        </Tab>
                    </Tabs>
                </Col>
                <Col>
                    {/* Evaluated page URL - Fallback if the URL refuses to connect*/}
                    <Stack gap={2}>
                        <Stack direction="horizontal" gap={1}>
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 500 }}
                                overlay={
                                    <Tooltip id="button-tooltip-2">
                                        Some webpage might refuse to connect, use the URL to visit the webpage.
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
                            <span className="">URL: </span>
                            <a className="align-items-center" target="_blank" href={url} rel="noreferrer">{url}</a>
                        </Stack>
                        {/* Embed the iframe */}
                        <Ratio aspectRatio="1x1">
                            <iframe title="Frame" src={url}>
                                <p>This page is not allowed to be embedded in iframes.</p>
                            </iframe>
                        </Ratio>
                    </Stack>
                </Col>
            </Row>
        </Container >
    )
}

export default ResultPageBody;