
/**
 *  App.jsx
 * 
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/HomePage";
import GuestResult from "./routes/GuestResultPage";

const App = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/:url" element={<GuestResult />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App;