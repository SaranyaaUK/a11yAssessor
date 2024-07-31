import React, { useState, createContext } from "react";

export const AppContext = createContext();
export const AuthenticationContext = createContext();

// To maintain the app context
export const AppContextProvider = props => {
    const [results, setResults] = useState([]);

    return (
        <AppContext.Provider
            value={{
                results,
                setResults
            }} >
            {props.children}
        </AppContext.Provider>
    )
}

// To maintain authenticated user details
export const AuthenticationContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AuthenticationContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated
            }}>
            {props.children}
        </AuthenticationContext.Provider>
    )
}