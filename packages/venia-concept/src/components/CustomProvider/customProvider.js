import React, { useState, useContext } from 'react';

const CustomContext = React.createContext();

export const CustomProvider = ({ children }) => {
    const [cartItem, setCartItem] = useState(null);
    const [priceSummary, setPriceSummary] = useState(null);
    const [files, setFiles] = useState([]);
    const [toogleStyles, setToogleStyles] = useState(false);

    return (
        <CustomContext.Provider
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
        </CustomContext.Provider>
    );
};

export const useCustomContext = () => {
    return useContext(CustomContext);
};
