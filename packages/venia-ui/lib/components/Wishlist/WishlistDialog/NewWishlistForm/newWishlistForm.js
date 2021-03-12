import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Relevant } from 'informed';

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
        onCreateList: props.onCreateList,
        isAddLoading: props.isAddLoading
    });

    const {
        formErrors,
        handleCancel,
        handleNewListClick,
        handleSave,
        isOpen,
        isSaveDisabled
    } = talonProps;

    const privateRadioText = formatMessage({
        id: 'newWishlistForm.privateRadio',
        defaultMessage: 'Private'
    });

    const publicRadioText = formatMessage({
        id: 'newWishlistForm.publicRadio',
        defaultMessage: 'Public'
    });

    const createButtonText = formatMessage({
        id: 'newWishlistForm.createButton',
        defaultMessage: '+ Create a new list'
    });

    const cancelButtonText = formatMessage({
        id: 'newWishlistForm.createButton',
        defaultMessage: 'Cancel'
    });

    const saveButtonText = formatMessage({
        id: 'newWishlistForm.saveButton',
        defaultMessage: 'Save'
    });

    const maybeForm = isOpen ? (
        <Fragment>
            <FormError
                // classes={{
                //     root: classes.formErrors
                // }}
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
                    // classes={{
                    //     radioLabel: classes.radioContents,
                    //     root: classes.radioRoot
                    // }}
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
            <Button
                // classes={{
                //     root_lowPriority: classes.cancelButton
                // }}
                onClick={handleCancel}
                priority="low"
                type="reset"
            >
                {cancelButtonText}
            </Button>
            <Button
                // classes={{
                //     root_highPriority: classes.confirmButton
                // }}
                disabled={isSaveDisabled}
                onClick={handleSave}
                priority="high"
                type="button"
            >
                {saveButtonText}
            </Button>
        </Fragment>
    ) : null;

    return (
        <Fragment>
            <button onClick={handleNewListClick} type="button">
                {createButtonText}
            </button>
            <Relevant when={() => !!isOpen}>{maybeForm}</Relevant>
        </Fragment>
    );
};

export default NewWishlistForm;
