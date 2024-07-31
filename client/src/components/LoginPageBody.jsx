import React, { useContext, useState } from "react";
import ServerAPI from "../apis/ServerAPI";
import { AuthenticationContext } from "../context/AppContext";
// React-Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
// Notification
import { toast } from "react-toastify";

const LoginPageBody = () => {
    const { setIsAuthenticated } = useContext(AuthenticationContext);
    // Initialise the login inputs state
    const [loginInputs, setLoginInputs] = useState({
        email: "",
        password: ""
    })

    const { email, password } = loginInputs;
    // Update the login inputs
    const onChange = (e) => {
        setLoginInputs({ ...loginInputs, [e.target.id]: e.target.value });
    }

    // Callback - Login button 
    const onLoginBtnClick = async (e) => {
        e.preventDefault();
    };

    // Callback - Password reset  
    const onPasswordResetBtnClick = async (e) => {
        e.preventDefault();
    };

    // Render the component
    return (
        <Container className="mb-2 mt-2 gradient-form" >
            <Row>
                <h2 className="mt-2 display-5">Welcome to a11yAssessor</h2>
            </Row>
            <Row>
                <Col className="d-flex flex-row align-items-center justify-content-center">
                    <Container style={{
                        backgroundImage: `url('./a11yBg.png')`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        height: 55 + "vh",
                        color: "white"
                    }}>
                    </Container>
                </Col>
                <Col>
                    <Container className="d-flex flex-column sm-5">

                        <p>Please login to your account</p>

                        {/* Get registered email address and password */}
                        <Form>
                            <Form.Group className="mb-2">
                                <Form.Label htmlFor="email">Email address</Form.Label>
                                <Form.Control
                                    value={email}
                                    onChange={e => onChange(e)}
                                    type="email"
                                    id="email"
                                    placeholder="name@example.com" />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <Form.Control
                                    value={password}
                                    onChange={e => onChange(e)}
                                    type="password"
                                    id="password" />
                            </Form.Group>
                        </Form>
                        <Container className="text-center pt-1 pb-1 mb-4 ">
                            {/*  Login button */}
                            <Button
                                onClick={onLoginBtnClick}
                                className="mb-4 w-100 gradient-custom-2">
                                Login
                            </Button>
                            {/*  Forgot password */}
                            <a className="text-muted"
                                href="#"
                                onClick={onPasswordResetBtnClick}>
                                Forgot password?
                            </a>
                        </Container>
                        {/* Register button */}
                        <Container className="d-flex flex-row align-items-center justify-content-center">
                            <p className="mb-0">Don't have an account?</p>
                            <Button
                                className='mx-2'
                                href="/register">
                                Register
                            </Button>
                        </Container>
                    </Container>
                </Col>
            </Row>

        </Container>
    )
}

export default LoginPageBody;