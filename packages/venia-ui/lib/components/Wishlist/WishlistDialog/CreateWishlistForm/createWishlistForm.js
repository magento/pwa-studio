import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { useCreateWishlistForm } from '@magento/peregrine/lib/talons/Wishlist/WishlistDialog/CreateWishlistForm/useCreateWishlistForm';

import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './createWishlistForm.module.css';
import FormError from '../../../FormError';
import { bool, func, shape, string } from 'prop-types';

const CreateWishlistForm = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const talonProps = useCreateWishlistForm({
        onCancel: props.onCancel,
        onCreateList: props.onCreateList,
        isAddLoading: props.isAddLoading
    });

    const { formErrors, handleCancel, handleSave, isSaveDisabled } = talonProps;

    const cancelButtonText = formatMessage({
        id: 'createWishlistForm.cancelButton',
        defaultMessage: 'Cancel'
    });

    const saveButtonText = formatMessage({
        id: 'createWishlistForm.saveButton',
        defaultMessage: 'Save'
    });

    return (
        <Fragment>
            <FormError
                classes={{
                    root: classes.formErrors
                }}
                errors={formErrors}
            />
            <div className={classes.listname}>
                <Field label="List Name">
                    <TextInput
                        id={classes.listname}
                        field="listname"
                        validate={isRequired}
                        data-cy="createWishlistForm-listname"
                    />
                </Field>
            </div>

            <div className={classes.actions}>
                <Button onClick={handleCancel} priority="low" type="reset">
                    {cancelButtonText}
                </Button>
                <Button
                    disabled={isSaveDisabled}
                    onClick={handleSave}
                    priority="high"
                    type="button"
                    data-cy="createWishListForm-saveButton"
                >
                    {saveButtonText}
                </Button>
            </div>
        </Fragment>
    );
};

export default CreateWishlistForm;

CreateWishlistForm.defaultProps = {
    classes: shape({
        actions: string,
        formErrors: string,
        listname: string,
        radioContents: string,
        radioRoot: string,
        visibility: string
    }),
    onCancel: func.isRequired,
    onCreateList: func.isRequired,
    isAddLoading: bool.isRequired
};
