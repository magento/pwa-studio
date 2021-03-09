import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { mergeClasses } from '../../classify';
import Dialog from '../Dialog';
import defaultClasses from './wishlistEditFavoritesListDialog.css';
import TextInput from '../TextInput/textInput';
import { isRequired } from '../../util/formValidators';
import Field from '../Field';
import RadioGroup from '../RadioGroup/radioGroup';

const WishlistEditFavoritesListDialog = props => {
    const {
        formProps,
        hasError,
        isOpen,
        isRemovalInProgress,
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
        body: classes.body,
        buttons: classes.buttons,
        cancelButton: classes.cancelButton,
        confirmButton: classes.confirmButton,
        contents: classes.contents
    };
    const maybeError = hasError ? (
        <p className={classes.errorMessage}>
            <FormattedMessage
                id={'wishlistEditFavoritesListDialog.errorMessage'}
                defaultMessage={
                    'There was an error editing this product. Please try again later.'
                }
            />
        </p>
    ) : null;

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
            shouldDisableAllButtons={isRemovalInProgress}
            title={dialogTitle}
        >
            <div className={classes.root}>
                {maybeError}
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
        body: string,
        buttons: string,
        cancelButton: string,
        confirmButton: string,
        contents: string,
        errorMessage: string,
        form: string,
        radioLabel: string,
        radioMessage: string,
        radioRoot: string,
        root: string
    }),
    formProps: object,
    hasError: bool,
    isOpen: bool,
    isRemovalInProgress: bool,
    onCancel: func,
    onConfirm: func
};
