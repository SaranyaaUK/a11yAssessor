
/**
 *  App.jsx
 *  Front-end Entry point
 * 
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Routes
import Home from "./routes/HomePage";
import GuestResult from "./routes/GuestResultPage";

// Context Hook
import { AppContextProvider } from './context/AppContext';

// Toasts
import 'react-toastify/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify';

const App = () => {
    return (
        <AppContextProvider>
            <div>
                <Router>
                    <Routes>
                        {/* Home Page */}
                        <Route exact path="/" element={<Home />} />
                        {/* Guest User Result Page */}
                        <Route exact path="/:url" element={<GuestResult />} />
                    </Routes>
                </Router>
                <ToastContainer />
            </div>
        </AppContextProvider>
    )
}

export default App;