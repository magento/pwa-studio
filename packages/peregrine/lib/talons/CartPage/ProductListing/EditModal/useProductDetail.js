export const useProductDetail = props => {
    const { item } = props;
    const { prices, product, quantity } = item;
    const { price } = prices;
    const { currency, value: unitPrice } = price;
    const {
        name,
        sku,
        small_image: smallImage,
        stock_status: stockStatusValue
    } = product;
    const { url: imageURL } = smallImage;

    return {
        currency,
        imageURL,
        name,
        quantity,
        unitPrice,
        sku,
        stockStatus: stockStatusLabels.get(stockStatusValue) || 'Unknown'
    };
};
