import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();
const MP_QUOTE_ID = 'mp_QUOTE_id';

import DEFAULT_OPERATIONS from '../requestQuote.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const operations = mergeOperations(DEFAULT_OPERATIONS);
const { getQuoteConfigDetailsQuery, getQuoteByIdQuery } = operations;

export const getConfigData = () => {
    const [isEnable, setIsEnable] = useState(false);
    const [configData, setConfigData] = useState();

    // Get config details
    const { data } = useQuery(getQuoteConfigDetailsQuery, {
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        if (data != undefined) {
            const { mpQuoteConfig } = data;
            setIsEnable(true);
            setConfigData(mpQuoteConfig);
        }
    }, [data]);

    return {
        isEnable,
        configData
    };
};

// Current quote id
export const setQuoteId = quote_id => {
    storage.setItem(MP_QUOTE_ID, quote_id);
};

export const deleteQuoteId = () => {
    storage.removeItem(MP_QUOTE_ID);
};

export const getQuoteId = () => {
    return storage.getItem(MP_QUOTE_ID);
};

export const getMpQuote = () => {
    const [myQuote, setMyQuote] = useState();

    if (getQuoteId() != undefined) {
        const { data } = useQuery(getQuoteByIdQuery, {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                quote_id: getQuoteId()
            }
        });

        useState(() => {
            if (data != undefined) {
                const {
                    mpQuote: { quote }
                } = data;
                setMyQuote(quote);
            }
        }, [data]);
    }

    return {
        ...myQuote
    };
};
