const canHandle = event => event.type === 'CATEGORY_PAGE_VIEW';

const handle = (sdk, event) => {
    const { payload } = event;

    const { name, url_key, url_path } = payload;

    const categoryContext = {
        name,
        urlKey: url_key,
        urlPath: url_path
    };

    sdk.context.setCategory(categoryContext);

    // Send out page view event
    const pageContext = {
        pageType: 'Category',
        pageName: name,
        eventType: 'visibilityHidden',
        maxXOffset: 0,
        maxYOffset: 0,
        minXOffset: 0,
        minYOffset: 0
    };

    sdk.context.setPage(pageContext);
    sdk.publish.pageView();
};

export default {
    canHandle,
    handle
};
