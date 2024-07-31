/**
 * 
 *  Header.jsx
 * 
 *  Defines the header component
 * 
 */


import React from "react";
// React-Bootstrap components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";

const Header = () => {
    return (
        <Navbar bg="light" collapseOnSelect expand="lg" data-bs-theme="light">
            <Container fluid>
                <Navbar.Brand href="/" >
                    <Image
                        alt=""
                        src="/a11y.png"
                        width="40"
                        height="35"
                        className="d-inline-block align-top"
                        loading="lazy"
                        rounded
                    />{' '}
                    a11yAssessor
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Link href="/">About</Nav.Link>
                        <Nav.Link href="/">Feature</Nav.Link>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    )
}

export default Header;