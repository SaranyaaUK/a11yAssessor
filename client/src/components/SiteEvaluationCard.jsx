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

const SiteEvaluationCard = ({ cardHeader, isButtonDisabled, timeStamp, site, isResultloading, iconClass, evalBtnClick, resultBtnClick }) => {

    // Render the component
    return (
        <Card style={{ height: "20rem" }} className="overflow-x-auto">
            <Card.Header>{cardHeader}</Card.Header>
            <Card.Body className="mt-3">
                <Stack gap={2}>
                    <Stack direction="horizontal" gap={2} className="mt-3">
                        {/* Icon for the evaluation */}
                        <i className={iconClass}></i>

                        {(isButtonDisabled) ?
                            (
                                <>
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
                            <Stack direction="veritcal" gap={1}>
                                {(isResultloading) ?
                                    (<Spinner animation="border" variation="success" size="sm" />) :
                                    (<i className="fa-solid fa-file-invoice" />)}
                                <>Result</>
                            </Stack>
                        </Button>
                    </Stack>
                    {(isButtonDisabled) ?
                        (
                            <>
                                {/* Summary of when the evaluation done last */}
                                <Stack direction="horizontal"
                                    gap={2}
                                    // size="md"
                                    className="pt-3 d-flex align-items-start">
                                    {/* Evaluation button if doing for the first-time */}
                                    <Badge bg="info"> Last Evaluation</Badge>
                                    <Badge bg="secondary">{"Not Evaluated"}</Badge>
                                </Stack>
                            </>) :
                        (
                            <>
                                {/* Summary of when the evaluation done last */}
                                <Stack direction="horizontal"
                                    gap={2}
                                    // size="md"
                                    className="pt-3 d-flex align-items-start">
                                    <Badge bg="info">Last Evaluation</Badge>
                                    <Badge bg="success">{new Date(timeStamp).toLocaleDateString(navigator.language)}</Badge>
                                    <Badge bg="success">{new Date(timeStamp).toLocaleTimeString()}</Badge>
                                </Stack>
                            </>)}
                </Stack>
            </Card.Body>
        </Card>

    )
}

export default SiteEvaluationCard;