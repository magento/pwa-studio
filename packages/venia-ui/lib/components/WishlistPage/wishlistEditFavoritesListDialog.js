import React from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStyle } from '../../classify';
import Dialog from '../Dialog';
import defaultClasses from './wishlistEditFavoritesListDialog.module.css';
import TextInput from '../TextInput';
import { isRequired } from '../../util/formValidators';
import Field from '../Field';
import FormError from '../FormError';

const WishlistEditFavoritesListDialog = props => {
    const {
        formErrors,
        formProps,
        isOpen,
        isEditInProgress,
        onCancel,
        onConfirm
    } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const dialogTitle = formatMessage({
        id: 'wishlistEditFavoritesListDialog.title',
        defaultMessage: 'Edit Favorites List'
    });

    const dialogClasses = {
        cancelButton: classes.cancelButton,
        confirmButton: classes.confirmButton
    };

    const listName = formatMessage({
        id: 'createWishlist.listName',
        defaultMessage: 'List Name'
    });

    return (
        <Dialog
            classes={dialogClasses}
            confirmTranslationId={'global.save'}
            confirmText={'Save'}
            cancelTranslationId={'global.cancelButton'}
            cancelText={'Cancel'}
            formProps={formProps}
            isModal={true}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            shouldDisableAllButtons={isEditInProgress}
            title={dialogTitle}
        >
            <div className={classes.root}>
                <FormError
                    classes={{ root: classes.errorMessage }}
                    errors={formErrors}
                />
                <div className={classes.form}>
                    <Field
                        classes={{ root: classes.listName }}
                        label={listName}
                    >
                        <TextInput
                            field="name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                </div>
            </div>
        </Dialog>
    );
};

export default WishlistEditFavoritesListDialog;

WishlistEditFavoritesListDialog.propTypes = {
    classes: shape({
        cancelButton: string,
        confirmButton: string,
        errorMessage: string,
        form: string,

        root: string
    }),
    formErrors: array,
    formProps: object,
    isOpen: bool,
    isEditInProgress: bool,
    onCancel: func,
    onConfirm: func
};
