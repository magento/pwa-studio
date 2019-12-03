import React, { useEffect } from 'react';
import { useQuery } from '@magento/peregrine';
import customerInfoQuery from '../../queries/getCustomerInfo.graphql';

const CustomerInfo = () => {
    // Writing this line causes failure
    const [{ data, error }, { runQuery, setLoading }] = useQuery(
        customerInfoQuery
    );
    return <p>Hello world</p>;
};