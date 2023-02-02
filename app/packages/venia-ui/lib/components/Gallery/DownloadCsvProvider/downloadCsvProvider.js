import React, { useState, useContext } from 'react';

const DownloadCsvContext = React.createContext();

export const DownloadCsvProvider = ({ children }) => {
    const [galleryItem, setGalleryItem] = useState([]);
    const [currentCatalog, setCurrentCatalog] = useState({});
    const [currentPrices, setCurrentPrices] = useState({});

    return (
        <DownloadCsvContext.Provider
            value={{
                galleryItem,
                setGalleryItem,
                currentCatalog,
                setCurrentCatalog,
                currentPrices,
                setCurrentPrices
            }}
        >
            {children}
        </DownloadCsvContext.Provider>
    );
};

export const useDownloadCsvContext = () => {
    return useContext(DownloadCsvContext);
};
