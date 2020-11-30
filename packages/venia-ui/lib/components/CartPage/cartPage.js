import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';

import { mergeClasses } from '../../classify';
import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import StockStatusMessage from '../StockStatusMessage';
import PriceAdjustments from './PriceAdjustments';
import ProductListing from './ProductListing';
import PriceSummary from './PriceSummary';
import defaultClasses from './cartPage.css';
import { GET_CART_DETAILS } from './cartPage.gql';

/**
 * Structural page component for the shopping cart.
 * This is the main component used in the `/cart` route in Venia.
 * It uses child components to render the different pieces of the cart page.
 *
 * @see {@link https://venia.magento.com/cart}
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides for the component.
 * See [cartPage.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CartPage from "@magento/venia-ui/lib/components/CartPage";
 */
const CartPage = props => {
    const talonProps = useCartPage({
        queries: {
            getCartDetails: GET_CART_DETAILS
        }
    });

    const {
        cartItems,
        hasItems,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator
    } = talonProps;
    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    const productListing = hasItems ? (
        <ProductListing setIsCartUpdating={setIsCartUpdating} />
    ) : (
        <h3>
            <FormattedMessage
                id={'cartPage.emptyCart'}
                defaultMessage={'There are no items in your cart.'}
            />
        </h3>
    );

    const priceAdjustments = hasItems ? (
        <PriceAdjustments setIsCartUpdating={setIsCartUpdating} />
    ) : null;
    const priceSummary = hasItems ? (
        <PriceSummary isUpdating={isCartUpdating} />
    ) : null;

    return (
        <div className={classes.root}>
            <Title>
                {formatMessage(
                    {
                        id: 'cartPage.title',
                        defaultMessage: 'Cart'
                    },
                    { name: STORE_NAME }
                )}
            </Title>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>
                    <FormattedMessage
                        id={'cartPage.heading'}
                        defaultMessage={'Cart'}
                    />
                </h1>
                <div className={classes.stockStatusMessageContainer}>
                    <StockStatusMessage cartItems={cartItems} />
                </div>
            </div>
            <div className={classes.body}>
                <div className={classes.items_container}>{productListing}</div>
                <div className={classes.price_adjustments_container}>
                    {priceAdjustments}
                </div>
                <div className={classes.summary_container}>
                    <div className={classes.summary_contents}>
                        {priceSummary}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
