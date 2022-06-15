export const searchRequestEvent = {
    type: 'SEARCH_REQUEST',
    payload: {
        query: 'selena',
        refinements: [
            {
                attribute: 'category_id',
                value: new Set(['Bottoms,11']),
                isRange: false
            },
            {
                attribute: 'fashion_color',
                value: new Set(['Rain,34', 'Mint,25']),
                isRange: false
            }
        ],
        sort: {
            attribute: 'relevance',
            order: 'DESC'
        },
        pageSize: 12,
        currentPage: 1
    }
};

export const searchbarRequestEvent = {
    type: 'SEARCHBAR_REQUEST',
    payload: {
        query: 'selena',
        currentPage: 1,
        pageSize: 3,
        refinements: []
    }
};
