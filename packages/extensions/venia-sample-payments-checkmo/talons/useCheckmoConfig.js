import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './loadCheckmoConfig.gql';

/**
 *
 * @param {*} props.operations GraphQL operations used by talons
 */
export const useCheckmoConfig = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCheckmoConfigQuery } = operations;
    const { data } = useQuery(getCheckmoConfigQuery);

    return {
        payableTo:
            data &&
            data.storeConfig &&
            data.storeConfig.payment_checkmo_payable_to,
        mailingAddress:
            data &&
            data.storeConfig &&
            data.storeConfig.payment_checkmo_mailing_address
    };
};
