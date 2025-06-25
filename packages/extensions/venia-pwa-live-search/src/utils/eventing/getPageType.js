import { useQuery } from '@apollo/client';
import query from '../../queries/eventing/getPageType.gql';

const pagetypeMap = {
    CMS_PAGE: 'CMS',
    CATEGORY: 'Category',
    PRODUCT: 'Product',
    '/cart': 'Cart',
    '/checkout': 'Checkout'
};

export const getPagetype = ({ pathname }) => {
    if (pathname) {
        const queryResult = useQuery(query.resolvePagetypeQuery, {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: { url: pathname }
        });
        const { data } = queryResult || {};
        const { urlResolver } = data || {};
        const { type } = urlResolver || {};
        // use pagetype from graphql, if it doesn't match, check pathname, if it doesn't match, return undefined.
        const pagetype = pagetypeMap[type] || pagetypeMap[pathname];
        return pagetype;
    }
};
