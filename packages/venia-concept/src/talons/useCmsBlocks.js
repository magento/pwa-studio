import { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';

export const useCmsBlock = props => {
    const { cmsBlockIdentifiers = [] } = props;

    const { data: cmsBlocksData, loading: cmsBlocksLoading } = useQuery(GET_CONTACT_PAGE_CMS_BLOCKS, {
        variables: {
            cmsBlockIdentifiers
        },
        fetchPolicy: 'cache-and-network'
    });

    const cmsBlocks = useMemo(() => {
        return cmsBlocksData?.cmsBlocks?.items || [];
    }, [cmsBlocksData]);

    return { cmsBlocks, cmsBlocksLoading };
};

export const GET_CONTACT_PAGE_CMS_BLOCKS = gql`
    query GetContactPageCmsBlocks($cmsBlockIdentifiers: [String]) {
        cmsBlocks(identifiers: $cmsBlockIdentifiers) {
            items {
                content
                identifier
            }
        }
    }
`;
