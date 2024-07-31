import React, { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
// React-Bootstrap components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
// Validator
import validator from "validator";
// API
import ServerAPI from "../apis/ServerAPI";
// Notification
import { toast } from "react-toastify";

const RegisterPageBody = () => {
    const navigate = useNavigate();
    // Initialise the registration inputs state
    const [signupInputs, setSignupInputs] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    // Update the registration inputs
    const { firstname, lastname, email, password, confirmPassword } = signupInputs;
    const onChange = (e) => {
        setSignupInputs({ ...signupInputs, [e.target.id]: e.target.value });
    }

    // Callback - Register button 
    const onRegisterBtnClick = async (e) => {
        e.preventDefault();

        try {
            // Validate email
            if (!validator.isEmail(email)) {
                toast.error("Enter a valid email, in the form as shown in the Email address input field",
                    { position: "top-center" }
                );
                return;
            }

            // Validate Password
            const regex = /^[a-zA-Z0-9]{6,15}$/;

            if (!regex.test(password) && !regex.test(confirmPassword)) {
                toast.error("Password must be 6-15 characters long and contain only alphanumeric characters",
                    { position: "top-center" }
                );
                return;
            }

            // Validate password match
            if (password !== confirmPassword) {
                toast.error("Password and Confirm Password do not match",
                    { position: "top-center" }
                );
                return;
            }

            const body = { firstname, lastname, email, password, confirmPassword };

            const response = await ServerAPI.post(`/auth/register`, JSON.stringify(body),
                {
                    headers: {
                        "Content-type": "application/json"
                    },
                }
            );

            if (response.data.success) {
                // After registration is successful, redirect to login page
                navigate(generatePath("/login"));
                toast.success(response.data && response.data.message, { position: "top-center" });
            } else {
                toast.error(response.data && response.data.message, { position: "top-center" });
            }


        } catch (err) {
            console.error(err.message);
        }
    };

    // Render the component
    return (
        <Container fluid className='p-4'>
            <Row>
                <Col md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
                    {/*  Register page content */}
                    <h1 className="text-center mb-5 display-3 fw-bold ls-tight px-3">
                        Accessibility is essential for some, <br />
                        <span className="text-primary">Useful for all</span>
                    </h1>

                    <p className='px-3 text-center' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                        We help you assess the digital accessibility of your webpage
                    </p>

                </Col>

                <Col md='6'>
                    {/* Registration page form */}
                    <Card>
                        <Card.Body className='p-3'>
                            <Row>
                                <Form>
                                    {/* First name */}
                                    <Form.Group className="mb-2">
                                        <Form.Label htmlFor="firstname">First Name</Form.Label>
                                        <Form.Control
                                            value={firstname}
                                            onChange={e => onChange(e)}
                                            type="text"
                                            id="firstname"
                                            placeholder="John" />
                                    </Form.Group>
                                    {/* Last name */}
                                    <Form.Group className="mb-2">
                                        <Form.Label htmlFor="lastname">Last Name</Form.Label>
                                        <Form.Control
                                            value={lastname}
                                            onChange={e => onChange(e)}
                                            type="text"
                                            id="lastname"
                                            placeholder="Doe" />
                                    </Form.Group>
                                    {/* Email address */}
                                    <Form.Group className="mb-2">
                                        <Form.Label htmlFor="email">Email address</Form.Label>
                                        <Form.Control
                                            value={email}
                                            onChange={e => onChange(e)}
                                            type="email"
                                            id="email"
                                            placeholder="johnd@example.com" />
                                    </Form.Group>
                                    {/* Password */}
                                    <Form.Group className="mb-2">
                                        <Form.Label htmlFor="password">Password</Form.Label>
                                        <Form.Control
                                            value={password}
                                            onChange={e => onChange(e)}
                                            type="password"
                                            id="password" />
                                        <Form.Text>
                                            Your password must be 6-15 characters long and contains only alphanumeric characters
                                        </Form.Text>
                                    </Form.Group>
                                    {/* Confirm password */}
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
                            {/*  Register button */}
                            <Row>
                                <Button
                                    onClick={onRegisterBtnClick}
                                    className='w-100 mb-2'
                                    size='md'>
                                    Register
                                </Button>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default RegisterPageBody;