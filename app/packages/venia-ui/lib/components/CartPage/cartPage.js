import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useReactToPrint } from 'react-to-print';
import { Check } from 'react-feather';
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';
import { useStyle } from '../../classify';
import { useToasts } from '@magento/peregrine';

import Icon from '../Icon';
import Button from '../Button';
import PriceSummary from './PriceSummary';
import { StoreTitle } from '../Head';
import defaultClasses from './cartPage.module.css';
import ProductListing from './ProductListing';
import PriceAdjustments from './PriceAdjustments';
import StockStatusMessage from '../StockStatusMessage';
import { fullPageLoadingIndicator } from '../LoadingIndicator';

import PrintPdfPopup from './PrintPdfPopup';
import SavedCartButton from '../BuyLaterNotes/SavedCartButton';
const CheckIcon = <Icon size={20} src={Check} />;

/**
 * Structural page component for the shopping cart.
 * This is the main component used in the `/cart` route in Venia.
 * It uses child components to render the different pieces of the cart page.
 *
 * @see {@link https://venia.magento.com/cart}
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides for the component.
 * See [cartPage.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CartPage from "@magento/venia-ui/lib/components/CartPage";
 */
const CartPage = props => {
    const talonProps = useCartPage();
    const [openPopup, setOpenPopup] = useState(false);

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });
    const {
        cartItems,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        wishlistSuccessProps
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const isPremium = process.env.B2BSTORE_VERSION === 'PREMIUM';

    useEffect(() => {
        if (wishlistSuccessProps) {
            addToast({ ...wishlistSuccessProps, icon: CheckIcon });
        }
    }, [addToast, wishlistSuccessProps]);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    const productListing = hasItems ? (
        <ProductListing
            onAddToWishlistSuccess={onAddToWishlistSuccess}
            setIsCartUpdating={setIsCartUpdating}
            fetchCartDetails={fetchCartDetails}
        />
    ) : (
        <h3>
            <FormattedMessage id={'cartPage.emptyCart'} defaultMessage={'There are no items in your cart.'} />
        </h3>
    );

    const priceAdjustments = hasItems ? <PriceAdjustments setIsCartUpdating={setIsCartUpdating} /> : null;

    const priceSummary = hasItems ? <PriceSummary isUpdating={isCartUpdating} /> : null;
    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

    const printPdfButton = (
        <Button priority={'normal'} onClick={handleOpenPopup}>
            <FormattedMessage id={'priceSummary.printPdfButton'} defaultMessage={'Print Pdf'} />
        </Button>
    );
    return (
        <div className={classes.root} data-cy="CartPage-root">
            <StoreTitle>
                {formatMessage({
                    id: 'cartPage.title',
                    defaultMessage: 'Cart'
                })}
            </StoreTitle>
            <div className={classes.heading_container}>
                <h1 data-cy="CartPage-heading" className={classes.heading}>
                    <FormattedMessage id={'cartPage.heading'} defaultMessage={'Cart'} />
                </h1>
                <div className={classes.stockStatusMessageContainer}>
                    <StockStatusMessage cartItems={cartItems} />
                </div>
            </div>
            <div className={classes.body}>
                <div className={classes.items_container}>{productListing}</div>
                <div className={classes.price_adjustments_container}>{priceAdjustments}</div>
                <div className={classes.summary_container}>
                    <div className={classes.summary_contents}>
                        {priceSummary}
                        <div className={classes.additionalOptionsContainer}>
                            {hasItems && isPremium ? <SavedCartButton /> : null}
                            {hasItems ? printPdfButton : null}
                        </div>
                    </div>
                </div>
                <PrintPdfPopup
                    ref={componentRef}
                    openPopup={openPopup}
                    handleClosePopup={handleClosePopup}
                    handlePrint={handlePrint}
                />
            </div>
        </div>
    );
};

export default CartPage;
