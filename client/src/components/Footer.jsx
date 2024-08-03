/**
 * 
 *  Footer.jsx
 *  
 *  Defines the footer component
 * 
 */

import React, { useContext } from "react";
// Context
import { AuthenticationContext } from "../context/AppContext";
// React-Bootstrap components
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

const Footer = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthenticationContext);

    const logout = e => {
        e.preventDefault();
        try {
            // Clear the token from the local storage
            localStorage.removeItem("token");
            setIsAuthenticated(false);
        } catch (err) {
            console.error(err.message);
        }
    };

    // Render the component
    return (
        <Container fluid>
            <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-1 my-1 border-top">
                <div className="col mb-3">
                    <a href="/" className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none">
                        <Image src="/a11y.png" height="80" alt="logo" loading="lazy" />
                    </a>
                    <p className="text-body-secondary">a11yAssessor © 2024</p>
                </div>

                <div className="col mb-3">
                    <h5>Company</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <a href="/" className="nav-link p-0 text-body-secondary">About Us</a>
                        </li>
                        <li className="nav-item mb-2">
                            <a href="/" className="nav-link p-0 text-body-secondary">Features</a>
                        </li>
                        {(!isAuthenticated) ?
                            (<li className="nav-item mb-2">
                                <a href="/login" className="nav-link p-0 text-body-secondary">Login</a>
                            </li>) :
                            (<li className="nav-item mb-2">
                                <a href="/" onClick={e => logout(e)} className="nav-link p-0 text-body-secondary">
                                    Logout
                                </a>
                            </li>)}
                    </ul>
                </div>

                <div className="col mb-3">
                    <h5>Contact Us</h5>
                    <ul className="nav flex-column">
                        <li className="nav-item mb-4">
                            <a href="mailto:" className="nav-link p-0 text-body-secondary">
                                <i className="fa-regular fa-envelope" ></i>{'  '}
                                a11yAssessor@outlook.com
                            </a>
                        </li>
                    </ul>
                </div>
            </footer >
        </Container>
    )
}

export default Footer;