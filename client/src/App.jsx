
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
import VerifyEmail from "./routes/VerifyEmailPage"
import ForgotPassword from './routes/ForgotPasswordPage';
import UserDashboard from './routes/UserDashboardPage';
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
            try {
                // If token is available validate it
                if (localStorage.getItem("token")) {
                    const response = await Server.get("/auth/verify",
                        {
                            headers: {
                                "token": localStorage.getItem("token")
                            },
                        });
                    response.data.success ? setIsAuthenticated(true) : setIsAuthenticated(false);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        }
        checkAuthentication();
    }, [setIsAuthenticated])

    // Render the component
    return (
        <AppContextProvider>
            <div>
                <Router>
                    <Routes>
                        {/* Home Page */}
                        <Route exact path="/" element={!isAuthenticated ? (<Home />) : (<Navigate to="/dashboard" />)} />
                        {/* Guest User Result Page */}
                        <Route exact path="/:url" element={<GuestResult />} />
                        {/* 
                            Authentication routes 
                        */}
                        {/* Login Page */}
                        <Route exact path="/login" element={!isAuthenticated ? (<Login />) : (<Navigate to="/dashboard" />)} />
                        {/* Registration Page */}
                        <Route exact path="/register" element={!isAuthenticated ? (<Register />) : (<Navigate to="/login" />)} />
                        {/* Email verification Page */}
                        <Route exact path="/activate/:id/:token" element={<VerifyEmail />} />
                        {/* Forgot Password Page */}
                        <Route exact path="/resetpassword/:id/:token" element={<ForgotPassword />} />
                        {/* 
                            Authorised routes 
                        */}
                        {/* User Dashboard */}
                        <Route exact path="/dashboard" element={isAuthenticated ? (<UserDashboard />) : (<Navigate to="/login" />)} />
                    </Routes>
                </Router>
                <ToastContainer />
            </div>
        </AppContextProvider>
    )
}

export default App;