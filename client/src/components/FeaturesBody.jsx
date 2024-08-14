/**
 * 
 *  FeaturesBody.jsx
 * 
 *  Defines the Features page content 
 * 
 */
import React from 'react';
// React-Bootstrap Components
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const FeaturesBody = () => {
    const features = [
        {
            title: 'Automated Testing',
            description: 'Effortlessly check your website’s compliance with industry standards using our advanced tools.',
            icon: 'fa-solid fa-robot',
        },
        {
            title: 'Guided Manual Evaluation',
            description: 'Ensure thorough compliance with our expert manual evaluation process.',
            icon: 'fa-solid fa-user-shield',
        },
        {
            title: 'Result Summary',
            description: 'Get a comprehensive overview of your accessibility evaluation results.',
            icon: 'fa-solid fa-file-invoice',
        },
        {
            title: 'Learning Hub',
            description: 'Enhance your skills with our comprehensive guides, and resources.',
            icon: 'fa-solid fa-graduation-cap',
        },
    ];

    return (
        <Container className="my-5">
            <Row className="text-center mb-5">
                <Col>
                    <h1 className="display-4">Our Features</h1>
                    <p className="lead text-muted">
                        Unlock the potential of web accessibility with our innovative tools and support.
                    </p>
                </Col>
            </Row>
            <Row>
                {features.map((feature, index) => (
                    <Col key={index} md={6} lg={3} className="mb-4">
                        <Card className="h-100 shadow-sm feature-card">
                            <Card.Body className="d-flex flex-column align-items-center text-center">
                                <div className="feature-icon mb-4">
                                    <i className={`${feature.icon} fa-3x text-primary`} aria-hidden="true"></i>
                                </div>
                                <Card.Title className="mb-3">{feature.title}</Card.Title>
                                <Card.Text className="text-muted">{feature.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default FeaturesBody;
