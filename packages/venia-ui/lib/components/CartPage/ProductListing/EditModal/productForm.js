import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useProductForm } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm';

import { useStyle } from '../../../../classify';
import FormError from '../../../FormError';
import LoadingIndicator from '../../../LoadingIndicator';
import Options from '../../../ProductOptions';
import QuantityStepper from '../../../QuantityStepper';
import defaultClasses from './productForm.module.css';
import Dialog from '../../../Dialog';
import ProductDetail from './productDetail';

const ProductForm = props => {
    const {
        item: cartItem,
        setIsCartUpdating,
        variantPrice,
        setVariantPrice,
        setActiveEditItem
    } = props;
    const { formatMessage } = useIntl();
    const talonProps = useProductForm({
        cartItem,
        setIsCartUpdating,
        setVariantPrice,
        setActiveEditItem
    });
    const {
        configItem,
        errors,
        handleOptionSelection,
        handleSubmit,
        outOfStockVariants,
        isLoading,
        isSaving,
        isDialogOpen,
        handleClose,
        configurableThumbnailSource
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const dialogButtonsDisabled = isLoading;
    const dialogSubmitButtonDisabled = isSaving;
    const dialogFormProps = {
        initialValues: cartItem
    };

    const message = isLoading
        ? formatMessage({
              id: 'productForm.fetchingProductOptions',
              defaultMessage: 'Fetching Product Options...'
          })
            ? isSaving
            : formatMessage({
                  id: 'productForm.updatingCart',
                  defaultMessage: 'Updating Cart...'
              })
        : null;

    const maybeLoadingIndicator =
        isLoading || isSaving ? (
            <LoadingIndicator
                classes={{
                    root: classes.loading
                }}
            >
                {message}
            </LoadingIndicator>
        ) : null;

    if (cartItem && !isLoading && !configItem) {
        return (
            <span className={classes.dataError}>
                <FormattedMessage
                    id={'productForm.dataError'}
                    defaultMessage={
                        'Something went wrong. Please refresh and try again.'
                    }
                />
            </span>
        );
    }

    const dialogContent =
        cartItem && configItem ? (
            <div>
                <FormError
                    classes={{
                        root: classes.errorContainer
                    }}
                    errors={Array.from(errors.values())}
                    scrollOnError={false}
                    allowErrorMessages={true}
                />
                <ProductDetail
                    item={cartItem}
                    variantPrice={variantPrice}
                    configurableThumbnailSource={configurableThumbnailSource}
                />
                <Options
                    classes={{
                        root: classes.optionRoot
                    }}
                    onSelectionChange={handleOptionSelection}
                    options={configItem.configurable_options}
                    selectedValues={cartItem.configurable_options}
                    outOfStockVariants={outOfStockVariants}
                />
                <h3 className={classes.quantityLabel}>
                    <FormattedMessage
                        id={'productForm.quantity'}
                        defaultMessage={'Quantity'}
                    />
                </h3>
                <QuantityStepper
                    classes={{
                        root: classes.quantityRoot
                    }}
                    initialValue={cartItem.quantity}
                    itemId={cartItem.id}
                />
            </div>
        ) : null;

    return (
        <Fragment>
            <Dialog
                classes={{
                    contents: classes.contents
                }}
                confirmText={'Update'}
                confirmTranslationId={'productForm.submit'}
                formProps={dialogFormProps}
                isOpen={isDialogOpen}
                onCancel={handleClose}
                onConfirm={handleSubmit}
                shouldDisableAllButtons={dialogButtonsDisabled}
                shouldDisableConfirmButton={dialogSubmitButtonDisabled}
                shouldUnmountOnHide={false}
                title={formatMessage({
                    id: 'editModal.headerText',
                    defaultMessage: 'Edit Item'
                })}
            >
                {maybeLoadingIndicator}
                {dialogContent}
            </Dialog>
        </Fragment>
    );
};

export default ProductForm;
