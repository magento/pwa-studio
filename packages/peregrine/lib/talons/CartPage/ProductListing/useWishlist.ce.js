import { useCallback } from 'react';
import { useIntl } from 'react-intl';

export const useWishlist = props => {
    const {
        addProductToWishlist,
        removeItemFromCart,
        cartId,
        item,
        onAddToWishlistSuccess,
        setDisplayError
    } = props;

    const { formatMessage } = useIntl();

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

            wishlistData &&
                onAddToWishlistSuccess({
                    type: 'info',
                    message: formatMessage({
                        id: 'cartPage.wishlist.ce.successMessage',
                        defaultMessage:
                            'Item successfully added to your favorites list.'
                    }),
                    timeout: 5000
                });

            await removeItemFromCart({
                variables: {
                    cartId,
                    itemId: item.id
                }
            });
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [
        addProductToWishlist,
        removeItemFromCart,
        formatMessage,
        cartId,
        item,
        onAddToWishlistSuccess,
        setDisplayError
    ]);

    return {
        handleAddToWishlist
    };
};
