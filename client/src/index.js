
/**
 *  index.js
 * 
 */

import React from "react"
import { createRoot } from 'react-dom/client';
import App from "./App"

// Insert the app to the root container
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />); // Insert the component to the root
