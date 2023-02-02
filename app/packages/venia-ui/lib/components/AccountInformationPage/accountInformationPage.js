import React, { Fragment, Suspense, useMemo, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAccountInformationPage } from '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage';
import { PlusSquare } from 'react-feather';
import { Form } from 'informed';

import { useStyle } from '../../classify';
import Button from '../Button';
import Field, { Message } from '../Field';
import { StoreTitle } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';

import defaultClasses from './accountInformationPage.module.css';
import AccountInformationPageOperations from './accountInformationPage.gql.js';

import Icon from '../Icon';
import LinkButton from '../LinkButton';
import AddressCard from '../AddressBookPage/addressCard';
import FormError from '../FormError';
import Checkbox from '../Checkbox';
import AddEditDialogCompanyInfo from './AddEditDialogCompanyInfo/addEditDialogCompanyInfo';
import { useToasts } from '@magento/peregrine';

const EditModal = React.lazy(() => import('./editModal'));

const AccountInformationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    //Communication
    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: formatMessage({
                id: 'communicationsPage.preferencesText',
                defaultMessage: 'Your preferences have been updated.'
            }),
            timeout: 5000
        });
    }, [addToast, formatMessage]);
    //

    const talonProps = useAccountInformationPage({
        ...AccountInformationPageOperations,
        afterSubmit
    });

    const {
        handleCancel,
        formErrorsCustomerAddress,
        handleChangePassword,
        handleSubmit,
        initialValues,
        isDisabled,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode,
        recaptchaWidgetProps,
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        formErrors,
        formProps,
        handleAddAddress,
        handleCancelDeleteAddress,
        handleCancelDialog,
        handleConfirmDeleteAddress,
        handleConfirmDialog,
        handleDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress,
        isDialogBusy,
        isDialogEditMode,
        isDialogOpen,
        formErrorsSubscribeToNewsletter,
        handleSubmitSubscribeToNewsletter,
        initialValuesSubscribeToNewsletter,
        isDisabledSubscribeToNewsletter
    } = talonProps;

    const validateIfBillingAddressExist = useMemo(() => {
        return customerAddresses?.filter(address => {
            return address.default_billing === true;
        });
    }, [customerAddresses]);

    const addressBookElements = useMemo(() => {
        const defaultToBeginning = (address1, address2) => {
            if (address1.default_shipping) return -1;
            if (address2.default_shipping) return 1;
            return 0;
        };

        return Array.from(customerAddresses)
            .sort(defaultToBeginning)
            .map(addressEntry => {
                const countryName = countryDisplayNameMap.get(addressEntry.country_code);

                const boundEdit = () => handleEditAddress(addressEntry);
                const boundDelete = () => handleDeleteAddress(addressEntry.id);
                const isConfirmingDelete = confirmDeleteAddressId === addressEntry.id;
                if (addressEntry.default_billing === true)
                    return (
                        <AddressCard
                            address={addressEntry}
                            countryName={countryName}
                            isConfirmingDelete={isConfirmingDelete}
                            isDeletingCustomerAddress={isDeletingCustomerAddress}
                            key={addressEntry.id}
                            onCancelDelete={handleCancelDeleteAddress}
                            onConfirmDelete={handleConfirmDeleteAddress}
                            onDelete={boundDelete}
                            onEdit={boundEdit}
                        />
                    );
            });
    }, [
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        handleCancelDeleteAddress,
        handleConfirmDeleteAddress,
        handleDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress
    ]);

    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id={'accountInformationPage.errorTryAgain'}
                defaultMessage={'Something went wrong. Please refresh and try again.'}
            />
        </Message>
    ) : null;

    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;
        const customerName = `${customer.firstname}`;
        const customerTaxVatId = `${customer.taxvat}`;
        const passwordValue = '***********';

        pageContent = (
            <Fragment>
                <div className={classes.accountDetails}>
                    <section className={classes.lineItemsContainerOuter}>
                        <div className={classes.lineItemsContainer}>
                            <StoreTitle>
                                {formatMessage({
                                    id: 'accountInformationPage.titleAccount',
                                    defaultMessage: 'Account Information'
                                })}
                            </StoreTitle>
                            <h1 className={classes.title} data-cy="AccountInformationPage-title">
                                <FormattedMessage
                                    id={'accountInformationPage.accountInformation'}
                                    defaultMessage={'Account Information'}
                                />
                            </h1>
                            <section className={classes.titleContainer}>
                                <article className={classes.title}>
                                    <FormattedMessage id={'global.companyName'} defaultMessage={'Company Name'} />
                                </article>
                                <article className={classes.nameValue}>{customerName}</article>
                            </section>
                            <section className={classes.titleContainer}>
                                <article className={classes.title}>
                                    <FormattedMessage id={'global.taxVatId'} defaultMessage={'Tax/Vat Id'} />
                                </article>
                                <article className={classes.nameValue}>{customerTaxVatId}</article>
                            </section>
                            <section className={classes.titleContainer}>
                                <span className={classes.title}>
                                    <FormattedMessage id={'global.email'} defaultMessage={'Email'} />
                                </span>
                                <span className={classes.emailValue}>{customer.email}</span>
                            </section>
                            <section className={classes.titleContainer}>
                                <span className={classes.title}>
                                    <FormattedMessage id={'global.password'} defaultMessage={'Password'} />
                                </span>
                                <span className={classes.passwordValue}>{passwordValue}</span>
                            </section>
                            <div className={classes.editButtonContainer}>
                                <Button
                                    className={classes.editInformationButton}
                                    disabled={false}
                                    onClick={showUpdateMode}
                                    priority="normal"
                                    data-cy="AccountInformationPage-editInformationButton"
                                >
                                    <FormattedMessage id={'global.editButton'} defaultMessage={'Edit'} />
                                </Button>
                            </div>
                        </div>
                    </section>
                    <section className={classes.addButtonContainer}>
                        {addressBookElements}

                        {validateIfBillingAddressExist.length > 0 ? null : (
                            <LinkButton
                                className={classes.addButton}
                                key="addAddressButton"
                                onClick={handleAddAddress}
                                data-cy="AddressBookPage-addButton"
                            >
                                <Icon
                                    classes={{
                                        icon: classes.addIcon
                                    }}
                                    size={24}
                                    src={PlusSquare}
                                />
                                <span className={classes.addText}>
                                    <FormattedMessage
                                        id={'addressBookPage.addAddressText'}
                                        defaultMessage={'Add an Address'}
                                    />
                                </span>
                            </LinkButton>
                        )}
                    </section>
                    <AddEditDialogCompanyInfo
                        formErrors={formErrorsCustomerAddress}
                        formProps={formProps}
                        isBusy={isDialogBusy}
                        isEditMode={isDialogEditMode}
                        isOpen={isDialogOpen}
                        onCancel={handleCancelDialog}
                        onConfirm={handleConfirmDialog}
                    />
                </div>
                <Suspense fallback={null}>
                    <EditModal
                        formErrors={formErrors}
                        initialValues={customer}
                        isDisabled={isDisabled}
                        isOpen={isUpdateMode}
                        onCancel={handleCancel}
                        onChangePassword={handleChangePassword}
                        onSubmit={handleSubmit}
                        shouldShowNewPassword={shouldShowNewPassword}
                        recaptchaWidgetProps={recaptchaWidgetProps}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'accountInformationPage.titleAccount',
                    defaultMessage: 'Account Information'
                })}
            </StoreTitle>
            {/* <h1 aria-live="polite" className={classes.title} data-cy="AccountInformationPage-title">
                <FormattedMessage
                    id={'accountInformationPage.accountInformation'}
                    defaultMessage={'Account Information'}
                />
            </h1> */}
            {errorMessage ? errorMessage : pageContent}

            {initialValuesSubscribeToNewsletter && (
                <div className={classes.container}>
                    <div className={classes.rootSubscribeToNewsletter}>
                        <FormError errors={formErrorsSubscribeToNewsletter} />
                        <Form
                            className={classes.form}
                            onSubmit={handleSubmitSubscribeToNewsletter}
                            initialValues={initialValuesSubscribeToNewsletter}
                        >
                            <Field
                                id="isSubscribed"
                                label={formatMessage({
                                    id: 'communicationsPage.eNewsletterText',
                                    defaultMessage: 'B2BStore E-Newsletter'
                                })}
                            >
                                <Checkbox
                                    field="isSubscribed"
                                    label={formatMessage({
                                        id: 'communicationsPage.subscribeText',
                                        defaultMessage: 'Stay updated; subscribe to the monthly B2BStore Newsletter.'
                                    })}
                                />
                            </Field>
                            <div className={classes.buttonsContainer}>
                                <Button disabled={isDisabledSubscribeToNewsletter} type="submit" priority="high">
                                    {isDisabledSubscribeToNewsletter
                                        ? formatMessage({
                                              id: 'communicationsPage.savingText',
                                              defaultMessage: 'Saving'
                                          })
                                        : formatMessage({
                                              id: 'communicationsPage.changesText',
                                              defaultMessage: 'Save Changes'
                                          })}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountInformationPage;
