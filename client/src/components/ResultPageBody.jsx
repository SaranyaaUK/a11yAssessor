/**
 * 
 *  ResultPageBody.jsx
 *  The component renders the body of the guest result page
 * 
 */
import React from "react";
// React-Bootstrap Components
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Ratio from 'react-bootstrap/Ratio';
import ResultAccordion from "./ResultAccordion";


const ResultPageBody = ({ url, results }) => {

    const errorsPresent = Object.keys(results.groupedErrors).length !== 0;
    const warningsPresent = Object.keys(results.groupedWarnings).length !== 0;
    const noticesPresent = Object.keys(results.groupedNotices).length !== 0;

    console.log(warningsPresent);
    console.log(noticesPresent);

    return (
        <Container>
            <Row>
                <h1 className="display-4"> Results </h1>
            </Row>

            <Row>
                <Col>
                    <Ratio aspectRatio="1x1">
                        <iframe title="Frame" src={url}>
                            <p>This page is not allowed to be embedded in iframes.</p>
                        </iframe>
                    </Ratio>

                </Col>
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
                                    (<ResultAccordion groupedResults={results.groupedErrors} />)
                            }
                        </Tab>

                        <Tab eventKey={1} title="Warnings">
                            {/* Display warnings if present and user is authenticated */}
                            {
                                (!warningsPresent) ?
                                    (<h2 className="d-flex justify-content-center align-items-center">No Warnings found</h2>) :
                                    (<ResultAccordion groupedResults={results.groupedWarnings} />)
                            }
                        </Tab>

                        <Tab eventKey={2} title="Notices">
                            {/* Display notices if present and user is authenticated */}
                            {/* <h2><a href="/">Login</a> to view notices</h2> */}
                            {
                                (!noticesPresent) ?
                                    (<h2 className="d-flex justify-content-center align-items-center">No Notices found</h2>) :
                                    (<ResultAccordion groupedResults={results.groupedNotices} />)
                            }
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container >
    )
}

export default ResultPageBody;