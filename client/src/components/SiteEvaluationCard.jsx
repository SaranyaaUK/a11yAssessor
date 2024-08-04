/**
 * SiteEvaluationCard.jsx 
 * 
 * Component that represents the card in the site dashboard page
 * 
 */

import React from "react";
// React-Bootstrap components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/esm/Badge";

const SiteEvaluationCard = ({ isButtonDisabled, timeStamp, site, isResultloading, iconClass, evalBtnClick, resultBtnClick }) => {

    // Render the component
    return (
        <Card style={{ height: "20rem" }} className="overflow-x-auto">
            <Card.Header>Automated Evaluation</Card.Header>
            <Card.Body className="mt-3">
                <Stack direction="horizontal" gap={2} className="mt-3">
                    {/* Icon for the evaluation */}
                    <i className={iconClass}></i>

                    {(isButtonDisabled) ?
                        (
                            <>
                                {/* Summary of when the evaluation done last */}
                                <Stack
                                    gap={1}
                                    size="md"
                                    className="me-auto ms-5 display-6 d-flex justify-content-center align-items-start">
                                    <p>Last Evaluation</p>
                                    <Badge bg="secondary">{"Not Evaluated"}</Badge>
                                </Stack>
                                {/* Evaluation button if doing for the first-time */}
                                <Button
                                    className="ms-auto"
                                    onClick={() => evalBtnClick(site.site_id, site.url)}>
                                    <Stack direction="veritcal" gap={1}>
                                        <i className="fa-solid fa-play" />
                                        <>Evaluate</>
                                    </Stack>
                                </Button>
                            </>) :
                        (
                            <>
                                {/* Summary of when the evaluation done last */}
                                <Stack
                                    gap={1}
                                    size="md"
                                    className="me-auto ms-5 display-6 d-flex justify-content-center align-items-start">
                                    <p>Last Evaluation</p>
                                    <Badge bg="secondary">{new Date(timeStamp).toLocaleDateString(navigator.language)}</Badge>
                                    <Badge bg="secondary">{new Date(timeStamp).toLocaleTimeString()}</Badge>
                                </Stack>
                                {/* Re-Evaluation button */}
                                <Button
                                    className="ms-auto"
                                    onClick={() => evalBtnClick(site.site_id, site.url)}>
                                    <Stack direction="veritcal" gap={1}>
                                        <i className="fa-solid fa-rotate-right" />
                                        <>Re-Evaluate</>
                                    </Stack>
                                </Button>
                            </>)}
                    {/* Result button */}
                    <Button
                        className="result-btn"
                        onClick={resultBtnClick} disabled={isButtonDisabled}>
                        {(isResultloading) ?
                            (<Spinner animation="border" variation="success" size="sm" />) :
                            (
                                <Stack direction="veritcal" gap={1}>
                                    <i className="fa-solid fa-file-invoice" />
                                    <>Result</>
                                </Stack>
                            )}
                    </Button>
                </Stack>
            </Card.Body>
        </Card>

    )
}

export default SiteEvaluationCard;