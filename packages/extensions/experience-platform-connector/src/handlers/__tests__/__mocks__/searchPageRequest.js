export default {
    type: 'SEARCH_REQUEST',
    payload: {
        query: 'belt',
        refinements: [
            {
                attribute: 'category_id',
                value: new Set(['Accessories,3']),
                isRange: false
            },
            {
                attribute: 'fashion_size',
                value: new Set(['M,44']),
                isRange: false
            }
        ],
        sort: {
            attribute: 'relevance',
            order: 'DESC'
        }
    }
};
