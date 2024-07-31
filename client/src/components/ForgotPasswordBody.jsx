/**
 * ForgotPasswordBody.jsx 
 * Component that represents the password reset page content
 * 
 */

import React, { useState } from "react";
import { generatePath, useNavigate, useLocation } from "react-router-dom";
import ServerAPI from "../apis/ServerAPI";
// React-Bootstrap components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
// Notification
import { toast } from "react-toastify";

const ForgotPasswordBody = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Initialise the password reset inputs
    const [resetInputs, setResetInputs] = useState({
        password: "",
        confirmPassword: ""
    })

    const { password, confirmPassword } = resetInputs;
    // Update the reset inputs
    const onChange = (e) => {
        setResetInputs({ ...resetInputs, [e.target.id]: e.target.value });
    }

    // Callbac - Reset button 
    const onResetBtnClick = async (e) => {
        e.preventDefault();

    };

    // Render the component
    return (
        <Container fluid className='p-4'>
            <Row>
                <Col md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
                    <h2 className="display-4">Reset Password</h2>
                </Col>

                {/* Get new password */}
                <Col md='6'>
                    <Card>
                        <Card.Body className='p-3'>
                            <Row>
                                <Form>
                                    <Form.Group className="mb-2">
                                        <Form.Label htmlFor="password">Password</Form.Label>
                                        <Form.Control
                                            value={password}
                                            onChange={e => onChange(e)}
                                            type="password"
                                            id="password" />
                                        <Form.Text>
                                            Your password must be 6-15 characters long, contains only alphanumeric characters
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                                        <Form.Control
                                            value={confirmPassword}
                                            onChange={e => onChange(e)}
                                            type="password"
                                            id="confirmPassword" />
                                    </Form.Group>
                                </Form>
                            </Row>
                            {/* Reset button */}
                            <Row>
                                <Button
                                    onClick={onResetBtnClick}
                                    className='w-100 mb-2'
                                    size='md'>
                                    Reset
                                </Button>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ForgotPasswordBody;