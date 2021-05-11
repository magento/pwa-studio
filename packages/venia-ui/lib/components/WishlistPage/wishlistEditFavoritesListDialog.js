import React from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { mergeClasses } from '../../classify';
import Dialog from '../Dialog';
import defaultClasses from './wishlistEditFavoritesListDialog.css';
import TextInput from '../TextInput';
import { isRequired } from '../../util/formValidators';
import Field from '../Field';
import RadioGroup from '../RadioGroup';
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

    const classes = mergeClasses(defaultClasses, props.classes);

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

    const radioGroupClasses = {
        message: classes.radioMessage,
        radioLabel: classes.radioLabel,
        root: classes.radioRoot
    };

    const radioGroupItems = [
        {
            label: formatMessage({
                id: 'global.private',
                defaultMessage: 'Private'
            }),
            value: 'PRIVATE'
        },
        {
            label: formatMessage({
                id: 'global.public',
                defaultMessage: 'Public'
            }),
            value: 'PUBLIC'
        }
    ];

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
                    <RadioGroup
                        classes={radioGroupClasses}
                        field="visibility"
                        items={radioGroupItems}
                    />
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
        radioLabel: string,
        radioMessage: string,
        radioRoot: string,
        root: string
    }),
    formErrors: array,
    formProps: object,
    isOpen: bool,
    isEditInProgress: bool,
    onCancel: func,
    onConfirm: func
};
