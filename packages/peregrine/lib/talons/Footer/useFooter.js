import { useQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';

import DEFAULT_OPERATIONS from './footer.gql';

/**
 *
 * @param {*} props.operations GraphQL operations used by talons
 */
export const useFooter = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCopyrightQuery } = operations;
    const { data } = useQuery(getCopyrightQuery);

    return {
        copyrightText: data && data.storeConfig && data.storeConfig.copyright
    };
};
