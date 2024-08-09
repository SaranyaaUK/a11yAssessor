/**
 * 
 *  UserDashboardSitesDisplay.jsx
 * 
 *  Defines the sites card display in user dashboard
 * 
 */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, generatePath } from "react-router-dom";
// Context
import { AppContext } from "../context/AppContext";
// React-Bootstrap components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
// API
import ServerAPI from "../apis/ServerAPI";
// Notification
import { toast } from "react-toastify";


const UserDashboardSitesDisplay = ({ searchData }) => {
    const navigate = useNavigate();
    // Context
    const { sitesList, setSitesList, siteImageList, setSitesImage } = useContext(AppContext);
    // States
    const [show, setShow] = useState(false);
    const [siteId, setSiteId] = useState("");

    // Show image of the webpage on the card
    useEffect(() => {
        const fetchResult = async () => {
            try {
                sitesList.map(async (item) => {
                    const response = await ServerAPI.get(`/getDOMElementImage`, {
                        params: {
                            url: item.url
                        }
                    });
                    setSitesImage((imageList) => ({
                        ...imageList,
                        [item.site_id]: response.data,
                    }))
                })
            } catch (err) {
                console.log(err);
            }
        }
        fetchResult();
    }, [sitesList, setSitesImage])

    // Callback - Delete site 
    const onDeleteBtnClick = async (e, site_id) => {
        e.preventDefault();
        // Set the site id
        setSiteId(site_id);
        handleShow();
    }

    // Callback - Visit Site Dashboard 
    const onProceedBtnClick = (site_id) => {
        navigate(generatePath(`/dashboard/${site_id}`));
    }

    // Callback - Delete confirmation
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ServerAPI.delete(`/site/${siteId}`, {
                headers: {
                    "token": localStorage.token
                }
            });

            if (response.data.success) {
                setSitesList(sitesList.filter(site => {
                    return site.site_id !== siteId;
                }));
                handleClose();
                toast.info("Site Removed", { position: "top-center" });
            } else {
                toast.error(response.data.message, { position: "top-center" });
            }
        } catch (error) {
            toast.error("Cannot delete the site, try again later!", { position: "top-center" });
        }
    }
    // Handle delete confirmation dialog visibility
    const handleClose = () => {
        setShow(false)
    };

    const handleShow = () => {
        setShow(true);
    }

    // Render the component
    return (
        <>
            <Row>
                {sitesList
                    // For live search
                    .filter((item) => {
                        return (searchData.toLowerCase() === "") ? item : (item.name.toLowerCase().includes(searchData));
                    })
                    // Make a card for each of the site
                    .map((item, index) => (
                        <Col key={index} md={3} className="pb-2">
                            <Card>
                                <Card.Header>
                                    <Stack direction="horizontal" gap={2}>
                                        {item.name.toUpperCase()}
                                        {/* Buttons on the header */}
                                        <Button
                                            className="ms-auto"
                                            onClick={() => onProceedBtnClick(item.site_id)}>
                                            <Stack direction="veritcal" gap={1}>
                                                <i className="fa-solid fa-circle-chevron-right" />
                                                <>Open</>
                                            </Stack>
                                        </Button>
                                        <Button onClick={(e) => onDeleteBtnClick(e, item.site_id)}>
                                            <Stack direction="veritcal" gap={1}>
                                                <i className="fa-solid fa-trash-can" />
                                                <>Delete</>
                                            </Stack>
                                        </Button>
                                    </Stack>
                                </Card.Header>
                                {/* Show a snapshot of the webpage on the card */}
                                {(siteImageList[item.site_id]) ?
                                    (<Card.Img className="p-2" src={`data:image/jpeg;base64,${siteImageList[item.site_id]}`} alt="" />) :
                                    (<Card.Img className="p-2 " src="/a11y.png" style={{ width: "320px", height: "180px" }} alt="" />)}
                            </Card>
                        </Col>
                    ))
                }
            </Row>
            {/*  Delete site - confirmation dialog */}
            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the site?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={(e) => onSubmit(e)}>Confirm</Button>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal >

        </>
    )
}

export default UserDashboardSitesDisplay;