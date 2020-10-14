import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from './footer.gql';

/**
 *
 * @param {*} props.operations GraphQL operations used by talons
 */
export const useFooter = (props = {}) => {
    const { operations = DEFAULT_OPERATIONS } = props;
    const { getCopyrightQuery } = operations;
    const { data } = useQuery(getCopyrightQuery);

    return {
        copyrightText: data && data.storeConfig && data.storeConfig.copyright
    };
};
