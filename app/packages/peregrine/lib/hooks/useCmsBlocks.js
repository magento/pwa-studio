import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from '../talons/Cms/cmsBlock.gql';
import mergeOperations from '../../util/shallowMerge';

export const useCmsBlock = props => {
    const { cmsBlockIdentifiers = [] } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCmsBlocksQuery } = operations;

    const { data: cmsBlocksData, loading: cmsBlocksLoading } = useQuery(getCmsBlocksQuery, {
        variables: {
            identifiers: cmsBlockIdentifiers
        },
        fetchPolicy: 'cache-and-network'
    });

    const cmsBlocks = useMemo(() => {
        return cmsBlocksData?.cmsBlocks?.items || [];
    }, [cmsBlocksData]);

    return { cmsBlocks, cmsBlocksLoading };
};
