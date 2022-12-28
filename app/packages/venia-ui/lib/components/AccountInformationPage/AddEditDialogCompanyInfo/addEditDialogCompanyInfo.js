import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import Country from '../../Country';
import Dialog from '../../Dialog';
import Field from '../../Field';
import FormError from '../../FormError';
import Postcode from '../../Postcode';
import Region from '../../Region';
import TextInput from '../../TextInput';
import defaultClasses from './addEditDialogCompanyInfo.module.css';

const AddEditDialogCompanyInfo = props => {
    const { formErrors, formProps, isBusy, isEditMode, isOpen, onCancel, onConfirm } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

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
        id: 'global.companyName&Name',
        defaultMessage: 'Company/Name'
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
        id: 'global.vatNumber',
        defaultMessage: 'VAT Number'
    });
    const cityLabel = formatMessage({
        id: 'global.city',
        defaultMessage: 'City'
    });
    const telephoneLabel = formatMessage({
        id: 'global.phoneNumber',
        defaultMessage: 'Phone Number'
    });

    return (
        <Dialog
            confirmTranslationId={'global.save'}
            confirmText="Save"
            formProps={formProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            shouldDisableAllButtons={isBusy}
            title={title}
        >
            <FormError classes={{ root: classes.errorContainer }} errors={Array.from(formErrors.values())} />
            <div className={classes.root} data-cy="AddEditDialog-root">
                <div className={classes.firstname}>
                    <Field id="firstname" label={firstNameLabel}>
                        <TextInput field="firstname" validate={isRequired} data-cy="firstname" />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field id="lastname" label={lastNameLabel}>
                        <TextInput field="lastname" data-cy="lastname" />
                    </Field>
                </div>
                <div className={classes.country}>
                    <Country field={'country_code'} validate={isRequired} data-cy="country" />
                </div>
                <div className={classes.street1}>
                    <Field id="street1" label={street1Label}>
                        <TextInput field="street[0]" validate={isRequired} data-cy="street[0]" />
                    </Field>
                </div>
                <div className={classes.street2}>
                    <Field id="vat_id" label={street2Label}>
                        <TextInput field="vat_id" data-cy="vat_id" />
                    </Field>
                </div>
                <div className={classes.city}>
                    <Field id="city" label={cityLabel}>
                        <TextInput field="city" validate={isRequired} data-cy="city" />
                    </Field>
                </div>
                <div className={classes.region}>
                    <Region
                        countryCodeField={'country_code'}
                        fieldInput={'region[region]'}
                        fieldSelect={'region[region_id]'}
                        optionValueKey="id"
                        validate={isRequired}
                        data-cy="region"
                    />
                </div>
                <div className={classes.postcode}>
                    <Postcode validate={isRequired} data-cy="Postcode" />
                </div>
                <div className={classes.telephone}>
                    <Field id="telephone" label={telephoneLabel}>
                        <TextInput field="telephone" validate={isRequired} data-cy="telephone" />
                    </Field>
                </div>
            </div>
        </Dialog>
    );
};

export default AddEditDialogCompanyInfo;

AddEditDialogCompanyInfo.propTypes = {
    classes: shape({
        root: string,
        city: string,
        country: string,
        default_address_check: string,
        errorContainer: string,
        firstname: string,
        lastname: string,
        middlename: string,
        postcode: string,
        region: string,
        street1: string,
        street2: string,
        telephone: string
    }),
    formErrors: object,
    isEditMode: bool,
    isOpen: bool,
    onCancel: func,
    onConfirm: func
};
