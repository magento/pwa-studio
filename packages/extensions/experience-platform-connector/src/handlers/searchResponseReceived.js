const canHandle = event => event.type === 'SEARCH_RESPONSE';

const handle = (sdk, event) => {
    const { payload } = event;

    const {
        categories,
        facets,
        page,
        perPage,
        products,
        searchRequestId,
        searchUnitId,
        suggestions
    } = payload;

    const searchResultsContext = {
        units: [
            {
                categories,
                facets,
                page,
                perPage,
                products,
                searchRequestId,
                searchUnitId,
                suggestions
            }
        ]
    };

    sdk.context.setSearchResults(searchResultsContext);
    sdk.publish.searchResponseReceived(searchUnitId, searchResultsContext);
};

export default {
    canHandle,
    handle
};
