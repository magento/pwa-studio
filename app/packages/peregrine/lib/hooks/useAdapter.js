import { useApolloClient } from '@apollo/client';
import { Magento2 } from '../RestApi';

import * as boilerplate from '@b2bstore/boilerplate-adapter';

export const useAdapter = () => {
    const apolloClient = useApolloClient();
    const { request: restClient } = Magento2;

    // let adapter;
    // if (process.env.BACKEND_TECH === 'magento') {
    //     adapter = magento;
    //     client = apolloClient;
    // } else if (process.env.BACKEND_TECH === 'bigcommerce') {
    //     adapter = bigcommerce;
    //     client = magento2Client;
    // }

    return {
        ...boilerplate,
        apolloClient,
        restClient
    };
};
