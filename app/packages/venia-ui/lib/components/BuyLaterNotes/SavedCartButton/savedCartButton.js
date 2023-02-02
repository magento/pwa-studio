import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';

import Button from '../../Button';
import SavedCartPopup from './savedCartPopup';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { useSavedCart } from '@magento/peregrine/lib/talons/BuyLaterNotes/useSavedCart';

import defaultClasses from './savedCartButton.module.css';

const SavedCartButton = props => {
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

export default SavedCartButton;

SavedCartButton.propTypes = {
    classes: shape({
        root: string
    })
};
