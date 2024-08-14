/**
 * 
 *  UserDashboardBody.jsx
 * 
 *  Defines the content of the user dashboard body
 * 
 */

import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
// React-Bootstrap components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
// Components
import SitesDisplay from "./UserDashboardSitesDisplay";
// API
import ServerAPI from "../apis/ServerAPI";
// Notification
import { toast } from "react-toastify";
// Validator
import validator from "validator";

const UserDashboardBody = (props) => {
    // Context
    const { sitesList, setSitesList, addSite } = useContext(AppContext);
    // States
    const [user, setUser] = useState(null);
    const [show, setShow] = useState(false);
    const [newSite, setNewSite] = useState({
        name: "",
        url: ""
    });
    const [search, setSearch] = useState("");

    // Get site info
    const { name, url } = newSite;
    const onChange = (e) => {
        setNewSite({ ...newSite, [e.target.id]: e.target.value });
    }

    // Use Effect Hook to get user info
    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await ServerAPI.get(`/auth/verify`, {
                    headers: {
                        "token": localStorage.getItem("token")
                    }
                });
                // Set user data
                if (response.data.success) {
                    setUser(response.data.user)
                } else {
                    toast.error(response.data.message, { position: "top-center" });
                }
            } catch (err) {
                toast.error("Cannot retrieve user info, login again", { position: "top-center" });
            }
        }
        fetchResult();
    }, []);

    // Use effect hook to set all the sites for the given user
    useEffect(() => {
        const getSitesList = async () => {
            try {
                const response = await ServerAPI.get(`/site`, {
                    headers: {
                        "token": localStorage.getItem("token")
                    }
                });
                // Set sites list
                if (response.data.success) {
                    setSitesList(response.data.sites);
                } else {
                    toast.error("Cannot retrive data!", { position: "top-center" });
                }
            } catch (err) {
                toast.error("Cannot retrive data!", { position: "top-center" });
            }
        }
        getSitesList();
    }, [setSitesList])

    // Callback - Add site submit clicked
    const onSubmit = async (e) => {
        e.preventDefault();
        // Validate the URL and name before proceeding 
        if (name === "") {
            toast.error("Webpage name is required to proceed",
                { position: "top-center" }
            );
            return;
        }
        const options = {
            protocols: ['http', 'https'],
            require_protocol: true,
            require_valid_protocol: true
        }
        if (!validator.isURL(url, options)) {
            toast.error("Enter a valid URL, in the form as shown in the URL input field",
                { position: "top-center" }
            );
            return;
        }
        // Add site to the database
        try {
            // Add the data to the request
            const body = { name, url };
            const response = await ServerAPI.post(`/site`, JSON.stringify(body),
                {
                    headers: {
                        "token": localStorage.getItem("token"),
                        "Content-type": "application/json"
                    },
                }
            );

            if (response.data.success) {
                addSite(response.data.site);
                handleClose();
                toast.info("Site Added", { position: "top-center" });
            } else {
                toast.error(response.data.message, { position: "top-center" });
            }
        } catch (err) {
            console.error(err.message);
            toast.error(err.message, { position: "top-center" });
        }

    }

    // Callback - Add site button clicked
    const onAddSiteBtnClick = (e) => {
        handleShow();
    }

    // Handle add site modal dialog visibility
    const handleClose = () => {
        setShow(false)
    };

    const handleShow = () => {
        setShow(true);
    }

    // Render the component
    return (
        <Container className="p-5" fluid>
            <Stack gap={3}>
                <Stack direction="horizontal" gap={2} className="me-2" >
                    {(!user) ?
                        (<h2>Welcome</h2>) :
                        (<h2>Welcome, {user.first_name + " " + user.last_name} !</h2>)
                    }
                    <Button
                        size="sm"
                        onClick={onAddSiteBtnClick}
                        className="ms-auto">
                        <Stack direction="horizontal" gap={2}>
                            <i className="fa-solid fa-circle-plus" />
                            <>Add Site</>
                        </Stack>
                    </Button>
                </Stack>
                <Stack direction="horizontal" gap={2} className="me-2">
                    <InputGroup className="ms-auto w-25">
                        <Form.Control
                            type="search"
                            placeholder="Search site"
                            aria-label="Search"
                            onChange={(e) => { setSearch(e.target.value) }}
                        />
                        <InputGroup.Text>
                            <i className="fa-solid fa-magnifying-glass" />
                        </InputGroup.Text>
                    </InputGroup>
                </Stack>
                <Stack direction="horizontal" gap={2}>
                    <Container
                        className="overflow-y-auto overflow-x-hidden p-2"
                        style={{ width: "100vw", height: 40 + "vh" }}
                        fluid>
                        {(sitesList.length === 0) ?
                            (<h3 className="d-flex justify-content-center mt-5">
                                Add a site to begin evaluation
                            </h3>) :
                            (<SitesDisplay searchData={search} />)}
                    </Container>
                </Stack>
            </Stack>

            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Add Webpage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Name</InputGroup.Text>
                        <Form.Control
                            value={name}
                            onChange={e => onChange(e)}
                            id="name"
                            type="text"
                            placeholder="Sample webpage page" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>URL</InputGroup.Text>
                        <Form.Control
                            type="url"
                            value={url}
                            id="url"
                            onChange={e => onChange(e)}
                            placeholder="https://www.example.com/home" />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success"
                        onClick={onSubmit}>
                        Add
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal >
        </Container >
    )
}

export default UserDashboardBody;