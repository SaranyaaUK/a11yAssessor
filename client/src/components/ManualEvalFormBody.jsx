/**
 * ManualEvalFormBody.jsx 
 * Component that represents the evaluation form
 * 
 */

import React, { useContext } from "react";
// React-Bootstrap components
import Accordion from "react-bootstrap/Accordion";
import AccordionItem from "react-bootstrap/AccordionItem";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
// Context
import { AppContext } from "../context/AppContext";

const ManualEvalFormBody = ({ formContent, principles }) => {
    const { evalFormData, setEvalFormData } = useContext(AppContext);

    // Update the result on change
    const onChange = (e, q_id) => {
        setEvalFormData({
            ...evalFormData,
            [q_id]: {
                ...evalFormData[q_id],
                [e.target.name]: e.target.value
            }
        });
    };

    // Render the component
    return (
        <>
            <Stack direction="vertical" gap={3}>
                <Stack>
                    <h1
                        className="d-flex justify-content-center align-items-center">
                        {formContent[0].principle_name}
                    </h1>
                    {principles.find(principle => principle.title === formContent[0].principle_name).description}
                </Stack>
                <Stack>
                    <Accordion>
                        {
                            // For each principle lay out all the guidelines with instructions for evaluation
                            formContent.map((item, index) => (
                                <AccordionItem key={index} eventKey={index + ""}>
                                    {/* Header */}
                                    <Accordion.Header>{item.title}</Accordion.Header>
                                    <Accordion.Body>
                                        <Stack direction="vertical" gap={3}>
                                            <h4>Evaluation</h4>
                                            <div>
                                                {/* Evaluation question accordion */}
                                                {item.questions ? (
                                                    <Accordion defaultActiveKey="0">
                                                        {item.questions.map((ques, q_id) => (
                                                            <AccordionItem key={q_id} eventKey={q_id + ""}>
                                                                <Accordion.Header>{ques.title}</Accordion.Header>
                                                                <Accordion.Body>
                                                                    <Stack direction="vertical" gap={2}>
                                                                        {/* Evaluation question */}
                                                                        <span>{ques.q_text}</span>
                                                                        {/* Instructions */}
                                                                        <Badge bg="secondary">Instructions</Badge>

                                                                        <ol>
                                                                            {ques.instructions.map((benefit, id) => (
                                                                                <li key={id}>{benefit}</li>
                                                                            ))}
                                                                        </ol>
                                                                        {/* Result and observation */}
                                                                        <Stack gap={2}>
                                                                            <div className="ms-auto d-flex align-items-center gap-3">
                                                                                <Badge bg="secondary">Result</Badge>
                                                                                <Form.Select
                                                                                    name="resultOption"
                                                                                    id={ques.q_id}
                                                                                    value={evalFormData[ques.q_id]?.resultOption || "Not Evaluated"}
                                                                                    onChange={(e) => onChange(e, ques.q_id)}
                                                                                >
                                                                                    <option>Not Evaluated</option>
                                                                                    <option>Pass</option>
                                                                                    <option>Fail</option>
                                                                                    <option>Not sure</option>
                                                                                    <option>Not applicable</option>
                                                                                </Form.Select>
                                                                            </div>
                                                                            <Badge bg="secondary">Observation</Badge>
                                                                            <textarea
                                                                                name="observation"
                                                                                id={ques.q_id}
                                                                                value={evalFormData[ques.q_id]?.observation || ""}
                                                                                onChange={(e) => onChange(e, ques.q_id)}
                                                                                placeholder={"Enter your observation"}
                                                                            />
                                                                        </Stack>
                                                                    </Stack>
                                                                </Accordion.Body>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                ) : (<h1>No Questions</h1>)}
                                            </div>
                                            {/*  Add more information about the guideline */}
                                            <h4>More Info</h4>
                                            <ul>
                                                {item.moreinfo.map((link, id) => (
                                                    <li key={id} className="text-break"><a href={link} target="_blank" rel="noreferrer">{link}</a></li>
                                                ))}
                                            </ul>
                                            {/*  Give the benefits acquired by the given success criteria */}
                                            <h4>Benefits</h4>
                                            <ul>
                                                {item.benefits.map((benefit, id) => (
                                                    <li key={id}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </Stack>
                                    </Accordion.Body>
                                </AccordionItem>
                            ))
                        }
                    </Accordion>
                </Stack>
            </Stack>
        </>
    );
}

export default ManualEvalFormBody;
