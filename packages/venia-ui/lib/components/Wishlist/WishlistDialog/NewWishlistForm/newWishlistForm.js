import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { useNewWishlistForm } from '@magento/peregrine/lib/talons/Wishlist/WishlistDialog/NewWishlistForm/useNewWishlistForm';

import Button from '@magento/venia-ui/lib/components/Button';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './newWishlistForm.css';
import FormError from '../../../FormError';

const NewWishlistForm = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const talonProps = useNewWishlistForm({
        onCancel: props.onCancel,
        onCreateList: props.onCreateList,
        isAddLoading: props.isAddLoading
    });

    const { formErrors, handleCancel, handleSave, isSaveDisabled } = talonProps;

    const privateRadioText = formatMessage({
        id: 'newWishlistForm.privateRadio',
        defaultMessage: 'Private'
    });

    const publicRadioText = formatMessage({
        id: 'newWishlistForm.publicRadio',
        defaultMessage: 'Public'
    });

    const cancelButtonText = formatMessage({
        id: 'newWishlistForm.createButton',
        defaultMessage: 'Cancel'
    });

    const saveButtonText = formatMessage({
        id: 'newWishlistForm.saveButton',
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
                    />
                </Field>
            </div>
            <div className={classes.visibility}>
                <RadioGroup
                    classes={{
                        radioLabel: classes.radioContents,
                        root: classes.radioRoot
                    }}
                    field="visibility"
                    initialValue={'PRIVATE'}
                    items={[
                        {
                            label: <span>{privateRadioText}</span>,
                            value: 'PRIVATE'
                        },
                        {
                            label: <span>{publicRadioText}</span>,
                            value: 'PUBLIC'
                        }
                    ]}
                />
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
                >
                    {saveButtonText}
                </Button>
            </div>
        </Fragment>
    );
};

export default NewWishlistForm;
