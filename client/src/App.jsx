
/**
 *  App.jsx
 *  Front-end Entry point
 * 
 */

import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Routes
import Home from "./routes/HomePage";
import GuestResult from "./routes/GuestResultPage";
import Login from './routes/LoginPage';
import Register from './routes/RegisterPage';

// Context Hook
import { AppContextProvider, AuthenticationContext } from './context/AppContext';

// API
import Server from "./apis/ServerAPI"

// Toasts
import 'react-toastify/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify';

const App = () => {
    // Context - Authentication
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthenticationContext);

    // useEffect Hook - To maintain state even on refresh
    useEffect(() => {
        const checkAuthentication = async () => {
            setIsAuthenticated(false);
        }
        checkAuthentication();
    }, [setIsAuthenticated])


    return (
        <AppContextProvider>
            <div>
                <Router>
                    <Routes>
                        {/* Home Page */}
                        <Route exact path="/" element={<Home />} />
                        {/* Guest User Result Page */}
                        <Route exact path="/:url" element={<GuestResult />} />
                        {/* Authentication routes */}
                        <Route exact path="/login" element={!isAuthenticated ? (<Login />) : (<Navigate to="/" />)} />
                        <Route exact path="/register" element={!isAuthenticated ? (<Register />) : (<Navigate to="/" />)} />
                    </Routes>
                </Router>
                <ToastContainer />
            </div>
        </AppContextProvider>
    )
}

export default App;