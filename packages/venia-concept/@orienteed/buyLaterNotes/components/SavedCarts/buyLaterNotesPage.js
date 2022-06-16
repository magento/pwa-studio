import React, { useMemo } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './buyLaterNotesPage.module.css';
import SavedCartsTable from './savedCartsTable';
import SavedCartsToolbar from './savedCartsToolbar';
import { useBuyLaterNotesPage } from '../../talons/useBuyLaterNotesPage';

const BuyLaterNotesPage = props => {
    const talonProps = useBuyLaterNotesPage();

    const {
        isLoading,
        handleIsLoading,
        carts,
        handlePageSize,
        handleCurrentPage,
        currentPage,
        totalPage,
        getSavedCarts,
        showCopyUrl
    } = talonProps;

    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'buyLaterNotesPage.pageTitleText',
        defaultMessage: 'Buy Later Notes'
    });

    const classes = useStyle(defaultClasses, props.classes);

    const BLOCK_TITLE = formatMessage({
        id: 'savedCartTable.blockTitleText',
        defaultMessage: 'Saved Carts'
    });

    const savedCartsTable = useMemo(() => {
        if (carts.length > 0) {
            return carts.map(cart => {
                return (
                    <SavedCartsTable
                        key={cart.cart_id}
                        cart={cart}
                        handleIsLoading={handleIsLoading}
                        getSavedCarts={getSavedCarts}
                        showCopyUrl={showCopyUrl}
                    />
                );
            });
        } else {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'buyLaterNotesPage.emptyDataMessage'}
                        defaultMessage={"You don't have any cart yet."}
                    />
                </h3>
            );
        }
    }, [carts]);

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return (
        <div className={classes.root}>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            <div className={classes.content}>
                <div className={classes.savedCartsTableSection}>
                    <h2 className={classes.blockHeading}>{BLOCK_TITLE}</h2>
                    <div className={classes.savedCartTable}>{savedCartsTable}</div>
                </div>
                <SavedCartsToolbar
                    currentPage={currentPage}
                    totalPage={totalPage}
                    handlePageSize={handlePageSize}
                    handleCurrentPage={handleCurrentPage}
                />
            </div>
        </div>
    );
};

export default BuyLaterNotesPage;

BuyLaterNotesPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        content: string
    })
};
