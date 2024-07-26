import React, { useState, createContext } from "react";

export const AppContext = createContext();

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