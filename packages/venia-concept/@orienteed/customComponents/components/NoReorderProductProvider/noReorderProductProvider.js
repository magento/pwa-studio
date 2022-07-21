import React, { useState, useContext } from 'react';

const NoReorderProductContext = React.createContext();

export const NoReorderProductProvider = ({ children }) => {
    const [noProduct, setNoProduct] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(false);

    return (
        <NoReorderProductContext.Provider
            value={{
                noProduct,
                setNoProduct,
                loadingProduct,
                setLoadingProduct
            }}
        >
            {children}
        </NoReorderProductContext.Provider>
    );
};

export const useNoReorderProductContext = () => {
    return useContext(NoReorderProductContext);
};
