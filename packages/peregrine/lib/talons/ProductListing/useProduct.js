export const useProduct = props => {
    const flatProduct = flattenProduct(props);

    return {
        handleEditItem: () => {},
        handleRemoveFromCart: () => {},
        handleToggleFavorites: () => {},
        product: flatProduct
    };
};

const flattenProduct = props => {
    const { item } = props;

    const {
        configurable_options: options = [],
        prices,
        product,
        quantity
    } = item;

    const { price } = prices;
    const { value: unitPrice, currency } = price;

    const { name, small_image } = product;
    const { url: image } = small_image;

    return { currency, image, name, options, quantity, unitPrice };
};
