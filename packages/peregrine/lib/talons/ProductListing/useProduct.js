export const useProduct = props => {
    const { item } = props;
    const { prices, product, quantity } = item;

    const { price, row_total: rowTotal } = prices;
    const { value: unitPrice } = price;
    const { value: totalPrice } = rowTotal;

    const { name, small_image } = product;
    const { url: image } = small_image;

    return { image, name, quantity, totalPrice, unitPrice };
};
