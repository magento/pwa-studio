/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAttributeMetadata } from '../api/search';
import { useStore } from './store';

// Remove the interface and type annotations since we're using JavaScript
const AttributeMetadataContext = createContext({
    sortable: [],
    filterableInSearch: []
});

const AttributeMetadataProvider = ({ children }) => {
    const [attributeMetadata, setAttributeMetadata] = useState({
        sortable: [],
        filterableInSearch: null
    });

    const storeCtx = useStore();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAttributeMetadata({
                ...storeCtx,
                apiUrl: storeCtx.apiUrl
            });
            if (data?.attributeMetadata) {
                setAttributeMetadata({
                    sortable: data.attributeMetadata.sortable,
                    filterableInSearch: data.attributeMetadata.filterableInSearch.map(
                        attribute => attribute.attribute
                    )
                });
            }
        };

        fetchData();
    }, [storeCtx]); // Added storeCtx as dependency to handle any changes to the context

    const attributeMetadataContext = {
        ...attributeMetadata
    };

    return (
        <AttributeMetadataContext.Provider value={attributeMetadataContext}>
            {children}
        </AttributeMetadataContext.Provider>
    );
};

const useAttributeMetadata = () => {
    const attributeMetadataCtx = useContext(AttributeMetadataContext);
    return attributeMetadataCtx;
};

export { AttributeMetadataProvider, useAttributeMetadata };
