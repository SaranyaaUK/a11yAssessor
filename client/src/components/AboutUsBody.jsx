/**
 * 
 *  AboutUsBody.jsx
 * 
 *  Defines the About us page content 
 * 
 */
import React from "react";
// React-Bootstrap Components
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";

const AboutUsBody = () => {

    return (
        <Container className="p-5" fluid>
            <Row>
                <Col>
                    <h1>About Us</h1>
                    <p className="d-flex justify-content-end">
                        Welcome to a11yAssessor, your trusted partner in creating inclusive and accessible digital experiences.
                        At a11yAssessor, we believe that the internet should be a place for everyone, regardless of their abilities.
                        Our mission is to empower web developers, and designers to build web content that is accessible to all users,
                        including those with disabilities.
                    </p>
                    <h2>Who We Are</h2>
                    <p className="d-flex justify-content-end">
                        a11yAssessor was founded in 2024 recognising the challenges faced by developers to develop accessible web content.
                        With a deep understanding of both the technical and human aspects of web accessibility,
                        our team is dedicated to making the web a more inclusive space for everyone.
                    </p>
                </Col>
                <Col md={4} className="mt-3 mb-3">
                    <Stack gap={2}>
                        <Stack direction="horizontal" gap={2} className="d-flex justify-content-center">
                            <i className="fa-solid fa-eye-low-vision fa-5x"></i>
                            <i className="fa-solid fa-ear-deaf fa-5x"></i>
                            <i className="fa-solid fa-hands-asl-interpreting fa-5x"></i>
                        </Stack>
                        <Stack direction="horizontal" gap={2} className="d-flex justify-content-center">
                            <i className="fa-solid fa-universal-access fa-5x"></i>
                        </Stack>
                        <Stack direction="horizontal" gap={2} className="d-flex justify-content-center">
                            <i className="fa-solid fa-audio-description fa-5x" />
                            <i className="fa-solid fa-braille fa-5x" />
                            <i className="fa-solid fa-closed-captioning fa-5x" />
                        </Stack>
                    </Stack>
                </Col>
            </Row>
            <Row>
                <h2>Our Commitment to Accessibility</h2>
                <p>
                    We are committed to promoting digital equality and ensuring that no one is left behind in the digital age.
                    By providing powerful tools and expert guidance, we help developers create accessible web content not only
                    compliant with legal standards but also usable and enjoyable for all users.

                </p>
            </Row>
            <Row>
                <h2>Join Us in Making the Web Accessible</h2>
                <p>
                    At a11yAssessor, we understand that accessibility is not just a checkbox but a crucial aspect of user experience.
                    We are here to support you on your journey to creating websites that are not only functional but also accessible to everyone.
                    Join us in our mission to make the web a more inclusive space for all.

                </p>

            </Row>
            <Row>
                <h2>Contact Us</h2>
                <p className="d-flex">
                    For any queries reach us at
                    <a href="mailto:" className="nav-link">
                        <i className="fa-regular fa-envelope mx-1" />
                        a11yAssessor@outlook.com
                    </a>

                </p>

            </Row>
        </Container >
    )
}

export default AboutUsBody;