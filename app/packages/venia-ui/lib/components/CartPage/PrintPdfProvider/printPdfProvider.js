import React, { useState, useContext } from 'react';

const PrintPdfContext = React.createContext();

export const PrintPdfProvider = ({ children }) => {
    const [cartItem, setCartItem] = useState(null);
    const [priceSummary, setPriceSummary] = useState({});
    const [files, setFiles] = useState([]);
    const [toogleStyles, setToogleStyles] = useState(false);

    return (
        <PrintPdfContext.Provider
            value={{
                cartItem,
                setCartItem,
                priceSummary,
                setPriceSummary,
                files,
                setFiles,
                toogleStyles,
                setToogleStyles
            }}
        >
            {children}
        </PrintPdfContext.Provider>
    );
};

export const usePrintPdfContext = () => {
    return useContext(PrintPdfContext);
};
