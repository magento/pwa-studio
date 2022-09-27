const canHandle = event =>
    ['SEARCH_REQUEST', 'SEARCHBAR_REQUEST'].includes(event.type);

const handle = (sdk, event) => {
    const { payload } = event;

    const { query, pageSize, currentPage, refinements, sort } = payload;

    const filter = refinements.map(refinement => {
        const { attribute, value } = refinement;
        return {
            attribute: attribute,
            in: Array.from(value.values())
        };
    });

    const requestContext = {
        units: [
            {
                searchUnitId: 'productPage',
                queryTypes: ['products'],
                phrase: query,
                pageSize: pageSize,
                currentPage: currentPage,
                filter: filter,
                sort: [{ attribute: sort?.attribute, direction: sort?.order }]
            }
        ]
    };

    sdk.context.setSearchInput(requestContext);
    sdk.publish.searchRequestSent();
};

export default {
    canHandle,
    handle
};
