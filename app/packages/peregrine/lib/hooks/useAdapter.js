import mergeOperations from '../util/shallowMerge';
import { Magento2 } from '../../lib/RestApi';
import { useAwaitQuery } from '../../lib/hooks/useAwaitQuery';
import { useLazyQuery, useMutation, useQuery, useSubscription } from '@apollo/client';

import { getResolvers } from '@b2bstore/boilerplate-adapter';

export const useAdapter = () => {
    const { request: restClient } = Magento2;

    const resolvers = getResolvers({
        mergeOperations,
        restClient,
        useAwaitQuery,
        useLazyQuery,
        useMutation,
        useQuery,
        useSubscription
    });

    return {
        ...resolvers
    };
};
