import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './savedCartButton.module.css';
import Button from '@magento/venia-ui/lib/components/Button';
import { useSavedCart } from '../../talons/SavedCarts/useSavedCart';
import SavedCartPopup from './savedCartPopup';

const savedCartButton = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useSavedCart();

    const {
        isShow,
        buttonTitle,
        isSaveCartLoading,
        handleSaveCart,
        isError,
        errorMessage,
        isDialogOpen,
        handleCancelDialog,
        handleSubmitDialog
    } = talonProps;

    const savedCartBtn = (
        <Button onClick={handleSaveCart} priority={'normal'}>
            <FormattedMessage id={'savedCartButton.saveCartBtn'} defaultMessage={buttonTitle} />
        </Button>
    );

    if (!isShow) {
        return null;
    }

    return (
        <div className={classes.root}>
            {savedCartBtn}
            <SavedCartPopup
                isOpen={isDialogOpen}
                onCancel={handleCancelDialog}
                handleSubmit={handleSubmitDialog}
                errorMessage={errorMessage}
                isError={isError}
                shouldDisableAllButtons={isSaveCartLoading}
            />
        </div>
    );
};

export default savedCartButton;

savedCartButton.propTypes = {
    classes: shape({
        root: string
    })
};
