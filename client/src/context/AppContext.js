import React, { useState, createContext } from "react";

export const AppContext = createContext();
export const AuthenticationContext = createContext();

// To maintain the app context
export const AppContextProvider = props => {
    const [results, setResults] = useState([]);
    const [sitesList, setSitesList] = useState([]);
    const [siteImageList, setSitesImage] = useState({});

    const addSite = (site) => {
        setSitesList([...sitesList, site]);
    }

    return (
        <AppContext.Provider
            value={{
                results,
                setResults,
                sitesList,
                setSitesList,
                addSite,
                siteImageList,
                setSitesImage
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