import { useApolloClient } from '@apollo/client';
import { Magento2 } from '../RestApi';

import * as magento from '@b2bstore/magento-adapter';
import * as bigcommerce from '@b2bstore/bigcommerce-adapter';

export const useAdapter = () => {
    const apolloClient = useApolloClient();
    const { request: magento2Client } = Magento2;
    let adapter, client;

    if (process.env.BACKEND_TECH === 'magento') {
        adapter = magento;
        client = apolloClient;
    } else if (process.env.BACKEND_TECH === 'bigcommerce') {
        adapter = bigcommerce;
        client = magento2Client;
    }

    return {
        client,
        getProducts: adapter.getProducts
    };
};
