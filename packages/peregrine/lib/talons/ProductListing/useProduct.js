export const useProduct = props => {
    const { item } = props;
    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const { price, row_total: rowTotal } = prices;
    const { value: unitPrice } = price;
    const { value: totalPrice } = rowTotal;

    const { name, small_image } = product;
    const { url: image } = small_image;

    return { image, name, options, quantity, totalPrice, unitPrice };
};
