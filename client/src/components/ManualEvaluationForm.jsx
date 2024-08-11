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
import Container from "react-bootstrap/esm/Container";
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
            console.log("FromData", evalFormData);
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
    const handleReset = async () => {
        // Reset the formData and then post the result
        setEvalFormData(initializeManualResult(evalFormDetails));
        await postResults();
    }

    // Callback - Save progress
    const handleSave = async () => {
        await postResults();
    }

    // Render the components
    return (
        <Container className="p-5">
            {evalFormDetails ? (
                <>
                    <Stack direction="horizontal" gap={2} className="p-3">
                        <Button className="reset-button ms-auto" onClick={handleReset}>Reset</Button>
                        <Button className="save-button " onClick={handleSave}>Save</Button>
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
        </Container>
    )

}

export default ManualEvaluationForm;