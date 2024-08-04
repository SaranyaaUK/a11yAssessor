/**
 * 
 *  ResultAccordion.jsx
 * 
 *  Defines the automated result accordion
 * 
 */

import { React, useState } from "react";
import ServerAPI from "../apis/ServerAPI";
// React-Bootstrap components
import Accordion from 'react-bootstrap/Accordion';
import AccordionItem from "react-bootstrap/AccordionItem";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Figure from "react-bootstrap/Figure";
import Button from "react-bootstrap/Button";
// Loading component
import Loading from "./Loading";


const ResultAccordion = ({ url, groupedResults }) => {
    // To handle the modal dialog to show the 
    // snapshot of the element
    const [show, setShow] = useState(false);
    const [image, setImage] = useState("");
    const [css, setSelector] = useState("");

    const handleClose = () => {
        setShow(false)
        setSelector("");
        setImage("");
    };

    // When user clicks to see the snapshot, make 
    // request to backend to get the element screenshot
    const handleShow = (selector) => {

        const fetchResult = async (selector) => {
            try {
                const response = await ServerAPI.get(`/getDOMElementImage`, {
                    params: {
                        css: selector,
                        url: url,
                        element: true
                    }
                });
                setSelector(selector);
                setImage(response.data);
            } catch (err) {
                console.log("Cannot retrieve image!");
            }
        }
        fetchResult(selector);
        setShow(true);
    }

    return (
        <>
            <Accordion defaultActiveKey="0">
                {
                    // Map the result as per the context and render the accordion
                    Object.keys(groupedResults).map((item, index) => (
                        <AccordionItem key={index} eventKey={index + ""}>
                            <Accordion.Header>
                                <Stack direction="horizontal" gap={2}>
                                    <div>{item.toUpperCase()}</div>
                                    <Badge pill bg={(groupedResults[item][0].typeCode === 1) ? "danger" : "warning"} className="p-2 ">
                                        {groupedResults[item].length}
                                    </Badge>
                                </Stack>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Stack gap={3}>
                                    <Stack direction="horizontal" gap={2}>
                                        <Badge pill bg="primary" className="p-2">Description</Badge>
                                        <div>{groupedResults[item][0].runnerExtras.help}</div>
                                        <Badge pill bg="info" className="p-2 m-2 ms-auto">
                                            <a target="_blank" rel="noreferrer"
                                                style={{ color: "white" }}
                                                href={groupedResults[item][0].runnerExtras.helpUrl}>
                                                More Info
                                            </a>
                                        </Badge>
                                    </Stack>
                                    <Stack gap={2}>
                                        <Accordion id="new" defaultActiveKey="0">
                                            {groupedResults[item].map((code, id) => (
                                                < AccordionItem key={id} eventKey={id + ""}>
                                                    <Accordion.Header> #{id + 1} {item}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <Stack direction="horizontal" gap={2}>
                                                            <Badge pill bg="primary" className="p-2 m-2">Context</Badge>
                                                            <div>{code.context}</div>
                                                        </Stack>
                                                        <Stack direction="horizontal" gap={2}>
                                                            <Badge pill bg="primary" className="p-2 m-2">Selector</Badge>
                                                            <div>{code.selector}</div>
                                                        </Stack>
                                                        <Stack direction="horizontal" gap={2}>
                                                            <i tabIndex="0"
                                                                onClick={() => handleShow(code.selector)}
                                                                className="fa-solid fa-eye p-2 m-2" />{"View Snapshot"}
                                                        </Stack>
                                                    </Accordion.Body>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </Stack>
                                </Stack>
                            </Accordion.Body>
                        </AccordionItem>
                    ))
                }

                <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                    <Modal.Header closeButton>
                        <Modal.Title>Element Screenshot</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Figure>
                            {(image.length === 0) ?
                                (<Loading />) :
                                (<Figure.Image src={`data:image/jpeg;base64,${image}`}
                                />)}
                            <Figure.Caption>Screenshot of the <i><b>{css}</b></i> element</Figure.Caption>
                        </Figure>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Accordion >
        </>
    )
}

export default ResultAccordion;