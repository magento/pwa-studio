import React from 'react';
import { array, bool, func, shape } from 'prop-types';
import { useIntl } from 'react-intl';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { isRequired } from '../../util/formValidators';
import Checkbox from '../Checkbox';
import Country from '../Country';
import Dialog from '../Dialog';
import Field from '../Field';
import FormError from '../FormError';
import Postcode from '../Postcode';
import Region from '../Region';
import TextInput from '../TextInput';
import defaultClasses from './addEditDialog.css';

const AddEditDialog = props => {
    const {
        activeEditAddress,
        formErrors,
        isEditMode,
        isOpen,
        handleCancel,
        handleConfirm
    } = props;

    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);

    let formatTitleArgs;
    if (isEditMode) {
        formatTitleArgs = {
            id: 'addressBookPage.editDialogTitle',
            defaultMessage: 'Edit Address'
        };
    } else {
        formatTitleArgs = {
            id: 'addressBookPage.addDialogTitle',
            defaultMessage: 'New Address'
        };
    }
    const title = formatMessage(formatTitleArgs);

    const firstNameLabel = formatMessage({
        id: 'global.firstName',
        defaultMessage: 'First Name'
    });
    const middleNameLabel = formatMessage({
        id: 'global.middleName',
        defaultMessage: 'Middle Name'
    });
    const lastNameLabel = formatMessage({
        id: 'global.lastName',
        defaultMessage: 'Last Name'
    });
    const street1Label = formatMessage({
        id: 'global.streetAddress',
        defaultMessage: 'Street Address'
    });
    const street2Label = formatMessage({
        id: 'global.streetAddress2',
        defaultMessage: 'Street Address 2'
    });
    const cityLabel = formatMessage({
        id: 'global.city',
        defaultMessage: 'City'
    });
    const telephoneLabel = formatMessage({
        id: 'global.phoneNumber',
        defaultMessage: 'Phone Number'
    });
    const defaultAddressCheckLabel = formatMessage({
        id: 'addressBookPage.makeDefaultAddress',
        defaultMessage: 'Make this my default address'
    });

    // TODO
    // const formProps = {
    //     initialValues: activeEditAddress
    // };

    return (
        <Dialog
            confirmTranslationId={'global.save'}
            confirmText="Save"
            isOpen={isOpen}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            title={title}
        >
            <FormError
                classes={{ root: classes.errorContainer }}
                errors={formErrors}
            />
            <div className={classes.root}>
                <div className={classes.firstname}>
                    <Field id="firstname" label={firstNameLabel}>
                        <TextInput field="firstname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.middlename}>
                    <Field
                        id="middlename"
                        label={middleNameLabel}
                        optional={true}
                    >
                        <TextInput field="middlename" />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field id="lastname" label={lastNameLabel}>
                        <TextInput field="lastname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.country}>
                    <Country validate={isRequired} />
                </div>
                <div className={classes.street1}>
                    <Field id="street1" label={street1Label}>
                        <TextInput field="street[0]" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.street2}>
                    <Field id="street2" label={street2Label} optional={true}>
                        <TextInput field="street[1]" />
                    </Field>
                </div>
                <div className={classes.city}>
                    <Field id="city" label={cityLabel}>
                        <TextInput field="city" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.region}>
                    <Region
                        fieldInput={'region[region]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey="id"
                        validate={isRequired}
                    />
                </div>
                <div className={classes.postcode}>
                    <Postcode validate={isRequired} />
                </div>
                <div className={classes.telephone}>
                    <Field id="telephone" label={telephoneLabel}>
                        <TextInput field="telephone" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.default_address_check}>
                    <Checkbox
                        field="make_default_check"
                        label={defaultAddressCheckLabel}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default AddEditDialog;

AddEditDialog.propTypes = {
    activeEditAddress: shape({}),
    classes: shape({}),
    formErrors: array,
    isEditMode: bool,
    isOpen: bool,
    handleCancel: func,
    handleConfirm: func
};
