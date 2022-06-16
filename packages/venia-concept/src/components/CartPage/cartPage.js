import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useReactToPrint } from 'react-to-print';
import { Check } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { useToasts } from '@magento/peregrine';
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Button from '@magento/venia-ui/lib/components/Button';
import PriceSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from '@magento/venia-ui/lib/components/CartPage/cartPage.module.css';
import ProductListing from '@magento/venia-ui/lib/components/CartPage/ProductListing';
import PriceAdjustments from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import PrintPdfPopup from '@orienteed/customComponents/components/PrintPdfPopup';
import AddProductByCsv from '@orienteed/customComponents/components/AddProductsByCsv/addProductByCsv';
import SavedCartButton from '@magento/venia-concept/src/components/SavedCartButton';

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
    // const onBeforeGetContentResolve = useRef();

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
        wishlistSuccessProps,
        csvErrorType,
        setCsvErrorType,
        csvSkuErrorList,
        setCsvSkuErrorList,
        isCsvDialogOpen,
        setIsCsvDialogOpen,
        handleCancelCsvDialog
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

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
                            {hasItems ? <SavedCartButton /> : null}
                            {hasItems ? printPdfButton : null}
                            <AddProductByCsv
                                csvErrorType={csvErrorType}
                                setCsvErrorType={setCsvErrorType}
                                csvSkuErrorList={csvSkuErrorList}
                                setCsvSkuErrorList={setCsvSkuErrorList}
                                isCsvDialogOpen={isCsvDialogOpen}
                                setIsCsvDialogOpen={setIsCsvDialogOpen}
                                handleCancelCsvDialog={handleCancelCsvDialog}
                            />
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
