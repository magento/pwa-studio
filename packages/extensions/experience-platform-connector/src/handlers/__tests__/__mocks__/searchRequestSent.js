export const searchRequestEvent = {
    type: 'SEARCH_REQUEST',
    payload: {
        query: 'Search Query Value',
        refinements: [
            {
                attribute: 'category_id',
                isRange: false,
                value: 'FilterEqualTypeInput'
            }
        ],
        sort: {
            attribute: 'Sort Attribute',
            order: 'DESC'
        }
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
