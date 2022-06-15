const canHandle = event => event.type === 'CMS_PAGE_VIEW';

const handle = (sdk, event) => {
    const { payload } = event;

    const { title } = payload;

    const context = {
        pageType: 'CMS',
        pageName: title,
        eventType: 'visibilityHidden',
        maxXOffset: 0,
        maxYOffset: 0,
        minXOffset: 0,
        minYOffset: 0
    };

    sdk.context.setPage(context);

    sdk.publish.pageView();
};

export default {
    canHandle,
    handle
};
