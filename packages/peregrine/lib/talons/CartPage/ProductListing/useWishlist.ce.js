import { useCallback } from 'react';

export const useWishlist = props => {
    const {
        addProductToWishlist,
        removeProductFromWishlist,
        removeItem,
        cartId,
        item,
        setDisplayError
    } = props;

    const handleAddToWishlist = useCallback(async () => {
        const sku = item.product.sku;
        const quantity = item.quantity;
        const selected_options = item.configurable_options.map(
            option => option.configurable_product_option_value_uid
        );

        try {
            const { data: wishlistData } = await addProductToWishlist({
                variables: {
                    wishlistId: '0',
                    itemOptions: {
                        sku,
                        quantity,
                        selected_options
                    }
                }
            });

            try {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: item.id
                    }
                });
            } catch (err) {
                // remove item from cart has failed, should roll back the change
                // by removing the item from the wishlist
                const selectedOptionsMapper = item.configurable_options.reduce(
                    (acc, option) => {
                        const { option_label, value_label } = option;
                        acc[option_label] = value_label;

                        return acc;
                    },
                    {}
                );

                const {
                    items: { items },
                    id: wishlistId
                } = wishlistData.addProductsToWishlist.wishlist;

                const productToDelete = items
                    .filter(({ product }) => product.sku === sku)
                    .find(item => {
                        const { configurable_options } = item;

                        return (
                            configurable_options.length &&
                            configurable_options.every(option => {
                                const { option_label, value_label } = option;

                                return (
                                    selectedOptionsMapper[option_label] ===
                                    value_label
                                );
                            })
                        );
                    });

                await removeProductFromWishlist({
                    variables: {
                        wishlistId: wishlistId,
                        wishlistItemId: productToDelete.id
                    }
                });

                throw new Error(err);
            }
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [
        addProductToWishlist,
        removeProductFromWishlist,
        removeItem,
        cartId,
        item,
        setDisplayError
    ]);

    return {
        handleAddToWishlist
    };
};
