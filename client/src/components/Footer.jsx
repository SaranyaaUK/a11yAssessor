/**
 * 
 *  Footer.jsx
 *  
 *  Defines the footer component
 * 
 */

import React from "react";
// React-Bootstrap components
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

const Footer = () => {
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
                        <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-body-secondary">About Us</a></li>
                        <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-body-secondary">Features</a></li>
                        <li className="nav-item mb-2"><a href="/login" className="nav-link p-0 text-body-secondary">Login</a></li>
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