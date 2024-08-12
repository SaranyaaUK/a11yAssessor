/**
 * 
 * ManualEvaluationForm.jsx 
 * 
 * Component that represents the evaluation form for guided evaluation
 * 
 */

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, generatePath } from "react-router-dom";
// React-Bootstrap components
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
// Components
import ManualEvalFormBody from "./ManualEvalFormBody";
import "react-form-wizard-component/dist/style.css";
import FormWizard from "react-form-wizard-component";
// API
import ServerAPI from "../apis/ServerAPI";
// Context
import { AppContext } from "../context/AppContext";

const ManualEvaluationForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Context
    const { evalFormData, setEvalFormData } = useContext(AppContext);
    // State
    const [evalFormDetails, setEvalFormDetails] = useState(null);
    const [show, setShow] = useState(false);
    const site_id = location.state.site_id;
    const url = location.state.url;
    const formWizardRef = React.createRef();

    // Initialise the guided evaluation form details
    const initializeManualResult = (evalFormDetails, formResult) => {
        let initialState = {};
        // Iterate over each principle category in evalFormDetails
        evalFormDetails && Object.keys(evalFormDetails.groupedGuidelines).forEach((principle) => {
            // Iterate over each guideline within the current principle
            evalFormDetails.groupedGuidelines[principle].forEach((guideline) => {
                // Iterate over each question in the current guideline
                let formResultForGuideline = formResult && formResult[principle][guideline.title];
                guideline.questions.forEach((ques) => {
                    let item = formResultForGuideline && formResultForGuideline.find(item => item.q_id === ques.q_id);
                    if (ques.q_id) {
                        initialState[ques.q_id] = {
                            resultOption: item?.result || "Not Evaluated",
                            observation: item?.observation || ""
                        };
                    } else {
                        console.error(`Question missing q_id: ${JSON.stringify(ques)}`);
                    }
                });
            });
        });

        return initialState;
    }

    // Get the evaluation form details
    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await ServerAPI.get(`/manual/evalFormDetails`,
                    {
                        headers: {
                            "token": localStorage.getItem("token"),
                        }
                    }
                );
                setEvalFormDetails(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchResult();
    }, [setEvalFormDetails]);

    // If the form is already filled pre-populate the data
    useEffect(() => {
        const fetchFormResult = async () => {
            const formResult = await ServerAPI.get(`/manual/results/${site_id}`,
                {
                    headers: {
                        "token": localStorage.getItem("token"),
                    }
                }
            );
            setEvalFormData(initializeManualResult(evalFormDetails, formResult.data.result));
        }

        fetchFormResult();
    }, [evalFormDetails, setEvalFormData, site_id]);

    // Post the result
    const postResults = async () => {
        try {
            const body = { site_id, evalFormData };
            await ServerAPI.post(`/manual/results`, JSON.stringify(body),
                {
                    headers: {
                        "Content-type": "application/json",
                        "token": localStorage.getItem("token")
                    }
                });
        } catch (err) {
            console.log(err);
        }
    }

    // Callback - Finish evaluation
    const handleComplete = async () => {
        // Handle form completion logic here
        await postResults();
        const path = generatePath(`/result/manual/${site_id}`);
        navigate(path, {
            state: {
                "url": url,
                "site_id": site_id
            }
        });
    };

    // Callback - Reset 
    const handleReset = (e) => {
        e.preventDefault();
        handleShow();
    }

    // Callback - Save progress
    const handleSave = async () => {
        await postResults();
    }

    // Callback - Home button 
    const onHomeBtnClick = (e) => {
        e.preventDefault();
        navigate(generatePath("/dashboard"));
    }

    // Callback - Site Home button 
    const onSiteHomeBtnClick = (e) => {
        e.preventDefault();
        navigate(generatePath(`/dashboard/${site_id}`));
    }

    // Callback - Reset confirmation
    const onSubmit = async (e) => {
        e.preventDefault();
        // Reset the formData and then post the result
        setEvalFormData(initializeManualResult(evalFormDetails));
        await postResults();
        handleClose();
    }

    // Handle delete confirmation dialog visibility
    const handleClose = () => {
        setShow(false)
    };

    const handleShow = () => {
        setShow(true);
    }

    // Render the components
    return (
        <Container className="p-5">
            {evalFormDetails ? (
                <>
                    <Stack gap={3}>
                        <Stack direction="horizontal" gap={2} className="p-3">
                            <Button className="reset-button" onClick={(e) => handleReset(e)}>Reset</Button>
                            <Button className="save-button " onClick={handleSave}>Save</Button>
                            {/* For navigation to user dashboard or site dashboard */}
                            <ButtonToolbar aria-label="Toolbar with button groups" className="ms-auto">
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
                            </ButtonToolbar>
                        </Stack>
                        <div className="ms-auto">
                            <span className="">Target webpage: </span>
                            <a className="align-items-center" target="_blank" href={decodeURIComponent(url)} rel="noreferrer">{decodeURIComponent(url)}</a>
                        </div>
                    </Stack>
                    {/* Multi-step form */}
                    <FormWizard
                        stepSize="sm"
                        onComplete={handleComplete}
                        ref={formWizardRef}
                    >
                        {/* Principle 1 - Perceivable */}
                        <FormWizard.TabContent title="Perceivable">
                            <ManualEvalFormBody
                                formContent={evalFormDetails.groupedGuidelines.Perceivable}
                                principles={evalFormDetails.principles} />
                        </FormWizard.TabContent>
                        {/* Principle 2 - Operable */}
                        <FormWizard.TabContent title="Operable">
                            <ManualEvalFormBody
                                formContent={evalFormDetails.groupedGuidelines.Operable}
                                principles={evalFormDetails.principles} />
                        </FormWizard.TabContent>
                        {/* Principle 3 - Understandable */}
                        <FormWizard.TabContent title="Understandable">
                            <ManualEvalFormBody
                                formContent={evalFormDetails.groupedGuidelines.Understandable}
                                principles={evalFormDetails.principles} />
                        </FormWizard.TabContent>
                        {/* Principle 4 - Robust */}
                        <FormWizard.TabContent title="Robust">
                            <ManualEvalFormBody
                                formContent={evalFormDetails.groupedGuidelines.Robust}
                                principles={evalFormDetails.principles} />
                        </FormWizard.TabContent>
                    </FormWizard>
                    <style>
                        {
                            `
                        /** 
                        * To left align the contents of the tab
                        */
                        .react-form-wizard .wizard-tab-content {
                            text-align: left;
                        }`
                        }
                    </style>
                </>
            ) :
                (<h1>Loading....</h1>)
            }
            {/* Reset confirmation dialog */}
            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Reset Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to reset the evaluation?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={(e) => onSubmit(e)}>Confirm</Button>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal >
        </Container>
    )

}

export default ManualEvaluationForm;