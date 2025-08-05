// src/hooks/eventing/usePageTypeFromUrl.js
import { useQuery } from '@apollo/client';
import query from '../../queries/eventing/getPageType.gql';

const pagetypeMap = {
    CMS_PAGE: 'CMS',
    CATEGORY: 'Category',
    PRODUCT: 'Product',
    '/cart': 'Cart',
    '/checkout': 'Checkout'
};

const usePageTypeFromUrl = pathname => {
    const { data } = useQuery(query.resolvePagetypeQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { url: pathname }
    });

    const type = data?.urlResolver?.type;
    const pageType = pagetypeMap[type] || pagetypeMap[pathname];

    return pageType;
};

export default usePageTypeFromUrl;
