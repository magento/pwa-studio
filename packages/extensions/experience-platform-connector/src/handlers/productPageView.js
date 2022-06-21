const canHandle = event => event.type === 'PRODUCT_PAGE_VIEW';

const handle = (sdk, event) => {
    const { payload } = event;

    const { name, id, currency_code, price_range, sku, url_key } = payload;

    const pageContext = {
        pageType: 'PDP',
        pageName: name,
        eventType: 'visibilityHidden',
        maxXOffset: 0,
        maxYOffset: 0,
        minXOffset: 0,
        minYOffset: 0
    };

    sdk.context.setPage(pageContext);

    sdk.publish.pageView();

    const productContext = {
        productId: id,
        name,
        sku,
        pricing: {
            currencyCode: currency_code,
            maximalPrice: price_range.maximum_price.final_price
        },
        canonicalUrl: url_key
    };

    sdk.context.setProduct(productContext);

    sdk.publish.productPageView();
};

export default {
    canHandle,
    handle
};
