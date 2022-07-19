import React, { useState, useContext } from 'react';

const NoReorderProductContext = React.createContext();

export const NoReorderProductProvider = ({ children }) => {
    const [noProduct, setNoProduct] = useState(false);

    return (
        <NoReorderProductContext.Provider
            value={{
                noProduct,
                setNoProduct
            }}
        >
            {children}
        </NoReorderProductContext.Provider>
    );
};

export const useNoReorderProductContext = () => {
    return useContext(NoReorderProductContext);
};
