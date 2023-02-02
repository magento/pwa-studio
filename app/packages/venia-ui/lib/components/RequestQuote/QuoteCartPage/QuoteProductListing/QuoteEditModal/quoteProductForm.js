import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Options from '@magento/venia-ui/lib/components/ProductOptions';
import { QuantityFields } from '../QuoteCartPage/QuoteProductListing/quoteQuantity';
import defaultClasses from './quoteProductForm.module.css';

import Dialog from '@magento/venia-ui/lib/components/Dialog';
import QuoteProductDetail from './quoteProductDetail';

const QuoteProductForm = props => {
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const dialogContent = (
        <div>
            <FormError
                classes={{
                    root: classes.errorContainer
                }}
            />
            <QuoteProductDetail />
            <Options
                classes={{
                    root: classes.optionRoot
                }}
            />
            <h3 className={classes.quantityLabel}>
                <FormattedMessage id={'productForm.quantity'} defaultMessage={'Quantity'} />
            </h3>
            <QuantityFields
                classes={{
                    root: classes.quantityRoot
                }}
            />
        </div>
    );

    return (
        <Fragment>
            <Dialog
                classes={{
                    contents: classes.contents
                }}
                title={formatMessage({
                    id: 'QuoteEditModal.headerText',
                    defaultMessage: 'Edit Item'
                })}
            >
                {dialogContent}
            </Dialog>
        </Fragment>
    );
};

export default QuoteProductForm;
