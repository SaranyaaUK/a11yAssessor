/**
 * 
 *  Loading.jsx
 * 
 *  Defines the spinner component 
 * 
 */
import React from "react";
// React-Bootstrap Components
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

const Loading = () => {

    return (
        // Spinner components to render when content is loading
        <Container className="d-flex justify-content-center">
            <Spinner size="xl" animation="border" variant="success" role="status">
                <span className="visually-hidden">Loading ...</span>
            </Spinner>
        </Container>
    )
}

export default Loading;