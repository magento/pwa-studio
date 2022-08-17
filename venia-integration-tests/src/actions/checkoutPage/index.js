import * as fields from '../../fields/checkoutPage';

export const toggleLoginDialog = () => {
    cy.get(fields.checkoutPageSignInButton).click();
};

export const reviewOrder = () => {
    cy.get(fields.checkoutPageReviewOrderButton).click();
};

export const placeOrder = () => {
    cy.get(fields.checkoutPagePlaceOrderButton).click();
};

export const selectCreditCardPaymentMethod = () => {
    cy.get(fields.checkoutPageCreditCardPaymentSelectInput).click();
};

/**
 * Utility function to set Guest Shipping Address
 *
 * @param {Object} data address data
 * @param {String} [data.email] email
 * @param {String} [data.firstName] first name
 * @param {String} [data.lastName] last name
 * @param {String} [data.countryCode] country code
 * @param {String} [data.street1] street 1
 * @param {String} [data.street2] street 2
 * @param {String} [data.city] city
 * @param {String} [data.regionId] region id
 * @param {String} [data.region] region text
 * @param {String} [data.postCode] postal code
 * @param {String} [data.telephone] phone number
 */
export const setGuestShippingAddress = ({
    email,
    firstName,
    lastName,
    countryCode,
    street1,
    street2,
    city,
    regionId,
    region,
    postCode,
    telephone
}) => {
    if (email) {
        cy.get(fields.checkoutPageGuestEmailInput)
            .clear()
            .type(email);
    }

    if (firstName) {
        cy.get(fields.checkoutPageShippingGuestFirstNameTextField).then(
            $input => {
                if ($input.attr('disabled') !== 'disabled') {
                    cy.wrap($input)
                        .clear()
                        .type(firstName);
                }
            }
        );
    }

    if (lastName) {
        cy.get(fields.checkoutPageShippingGuestLastNameTextField).then(
            $input => {
                if ($input.attr('disabled') !== 'disabled') {
                    cy.wrap($input)
                        .clear()
                        .type(lastName);
                }
            }
        );
    }

    if (countryCode) {
        cy.get(fields.checkoutPageShippingGuestCountrySelect).select(
            countryCode
        );
    }

    if (street1) {
        cy.get(fields.checkoutPageShippingGuestStreet1TextField)
            .clear()
            .type(street1);
    }

    if (street2) {
        cy.get(fields.checkoutPageShippingGuestStreet2TextField)
            .clear()
            .type(street2);
    }

    if (city) {
        cy.get(fields.checkoutPageShippingGuestCityTextField)
            .clear()
            .type(city);
    }

    if (regionId) {
        cy.get(fields.checkoutPageShippingGuestRegionField).select(regionId);
    } else if (region) {
        cy.get(fields.checkoutPageShippingGuestRegionField)
            .clear()
            .type(region);
    }

    if (postCode) {
        cy.get(fields.checkoutPageShippingGuestPostCodeTextField)
            .clear()
            .type(postCode);
    }

    if (telephone) {
        cy.get(fields.checkoutPageShippingGuestTelephoneTextField)
            .clear()
            .type(telephone);
    }

    cy.get(fields.checkoutPageShippingGuestSubmitButton).click();
};

/**
 * Utility function to set Customer Shipping Address
 *
 * @param {Object} data address data
 * @param {String} [data.firstName] first name
 * @param {String} [data.lastName] last name
 * @param {String} [data.countryCode] country code
 * @param {String} [data.street1] street 1
 * @param {String} [data.street2] street 2
 * @param {String} [data.city] city
 * @param {String} [data.regionId] region id
 * @param {String} [data.region] region text
 * @param {String} [data.postCode] postal code
 * @param {String} [data.telephone] phone number
 */
export const setCustomerShippingAddress = ({
    firstName,
    lastName,
    countryCode,
    street1,
    street2,
    city,
    regionId,
    region,
    postCode,
    telephone
}) => {
    if (firstName) {
        cy.get(fields.checkoutPageShippingCustomerFirstNameTextField).then(
            $input => {
                if ($input.attr('disabled') !== 'disabled') {
                    cy.wrap($input)
                        .clear()
                        .type(firstName);
                }
            }
        );
    }

    if (lastName) {
        cy.get(fields.checkoutPageShippingCustomerLastNameTextField).then(
            $input => {
                if ($input.attr('disabled') !== 'disabled') {
                    cy.wrap($input)
                        .clear()
                        .type(lastName);
                }
            }
        );
    }

    if (countryCode) {
        cy.get(fields.checkoutPageShippingCustomerCountrySelect).select(
            countryCode
        );
    }

    if (street1) {
        cy.get(fields.checkoutPageShippingCustomerStreet1TextField)
            .clear()
            .type(street1);
    }

    if (street2) {
        cy.get(fields.checkoutPageShippingCustomerStreet2TextField)
            .clear()
            .type(street2);
    }

    if (city) {
        cy.get(fields.checkoutPageShippingCustomerCityTextField)
            .clear()
            .type(city);
    }

    if (regionId) {
        cy.get(fields.checkoutPageShippingCustomerRegionField)
            .should('not.be.disabled')
            .select(regionId);
    } else if (region) {
        cy.get(fields.checkoutPageShippingCustomerRegionField)
            .should('not.be.disabled')
            .clear()
            .type(region);
    }

    if (postCode) {
        cy.get(fields.checkoutPageShippingCustomerPostCodeTextField)
            .clear()
            .type(postCode);
    }

    if (telephone) {
        cy.get(fields.checkoutPageShippingCustomerTelephoneTextField)
            .clear()
            .type(telephone);
    }

    cy.get(fields.checkoutPageShippingCustomerSubmitButton).click();
};

/**
 * Utility function to edit Credit Cart Information
 *
 * @param {Object} data credit card data
 * @param {String} [data.name] cardholder name
 * @param {String} [data.number] card number
 * @param {String} [data.expiration] expiration date
 * @param {String} [data.cvv] CVV
 */
export const editCreditCardInformation = ({
    name,
    number,
    expiration,
    cvv
}) => {
    cy.getIframeBody(fields.checkoutPageCreditCardNameFrame)
        .find(fields.checkoutPageCreditCardCardFrameholderName)
        .clear()
        .type(name);

    cy.getIframeBody(fields.checkoutPageCreditCardCardFrame)
        .find(fields.checkoutPageCreditCardFrameCardNumberField)
        .clear()
        .type(number);

    cy.getIframeBody(fields.checkoutPageCreditCardExpirationFrame)
        .find(fields.checkoutPageCreditCardFrameExpirationField)
        .clear()
        .type(expiration);

    cy.getIframeBody(fields.checkoutPageCreditCardCodeFrame)
        .find(fields.checkoutPageCreditCardFrameCodeField)
        .clear()
        .type(cvv);
};

/**
 * Utility function to create account from Order Confirmation Page
 *
 * @param {Object} data user data
 * @param {String} [data.firstName] first name
 * @param {String} [data.lastName] last name
 * @param {String} [data.email] email
 * @param {String} data.password password
 * @param {Boolean} [data.isSubscribed] subscribe to newsletter
 */
export const createAccountFromOrderConfirmationPage = ({
    firstName,
    lastName,
    email,
    password,
    isSubscribed = false
}) => {
    if (firstName) {
        cy.get(fields.orderConfirmationCreateAccountFirstNameTextField)
            .clear()
            .type(firstName);
    }

    if (lastName) {
        cy.get(fields.orderConfirmationCreateAccountLastNameTextField)
            .clear()
            .type(lastName);
    }

    if (email) {
        cy.get(fields.orderConfirmationCreateAccountEmailTextField)
            .clear()
            .type(email);
    }

    cy.get(fields.orderConfirmationCreateAccountPasswordTextField)
        .clear()
        .type(password);

    if (isSubscribed) {
        cy.get(fields.orderConfirmationCreateAccountNewsletterCheckbox).check();
    } else {
        cy.get(
            fields.orderConfirmationCreateAccountNewsletterCheckbox
        ).uncheck();
    }

    cy.get(fields.orderConfirmationCreateAccountCreateAccountButton).click();
};

/**
 * Utility function to submit the selected shipping method on CheckoutPage
 */
export const submitShippingMethod = (isEditing = false) => {
    const container = isEditing
        ? fields.checkoutPageOpenedDialogSubmitButton
        : fields.checkoutPageShippingMethodSubmitButton;
    cy.get(container).click();
};

/**
 * Utility function open the edit dialog for Shipping Information
 */
export const openEditShippingInformationDialog = () => {
    cy.get(fields.checkoutPageEditShippingInfoButton).click();
};

/**
 * Utility function open the edit dialog for Shipping Method
 */
export const openEditShippingMethodDialog = () => {
    cy.get(fields.checkoutPageEditShippingMethodButton).click();
};

/**
 * Utility function to select a shipping method on CheckoutPage
 */
export const selectShippingMethod = shippingMethod => {
    cy.get(fields.checkoutPageShippingMethodRadiolabel)
        .contains(shippingMethod)
        .click();
};

/**
 * Utility function open the edit dialog for Payment Information
 */
export const openEditPaymentInformationDialog = () => {
    cy.get(fields.checkoutPageEditCreditCardButton).click();
};

/**
 * Utility function to toggle Biiling Address Form on CheckoutPage
 */
export const toggleBillingAddressForm = () => {
    cy.get(fields.checkoutPageCreditCardBillingAddressCheckbox).click();
};

/**
 * Utility function to fill billing address data on CheckoutPage
 *
 * @param {Object} data billing address data
 * @param {String} [data.firstName] first name
 * @param {String} [data.lastName] last name
 * @param {String} [data.street1] street 1
 * @param {String} [data.street2] street 2
 * @param {String} [data.city] city
 * @param {String} [data.countryCode] code for selecting country
 * @param {String} [data.regionId] region Id for selecting region
 * @param {String} [data.region] region text
 * @param {String} [data.postCode] postal code
 * @param {String} [data.telephone] phone number
 */
export const editBillingAddress = ({
    firstName,
    lastName,
    street1,
    street2,
    city,
    countryCode,
    regionId,
    region,
    postCode,
    telephone
}) => {
    if (firstName) {
        cy.get(fields.checkoutPageBillingAddressFirstNameTextField).then(
            $input => {
                if ($input.attr('disabled') !== 'disabled') {
                    cy.wrap($input)
                        .clear()
                        .type(firstName);
                }
            }
        );
    }

    if (lastName) {
        cy.get(fields.checkoutPageBillingAddressLastNameTextField).then(
            $input => {
                if ($input.attr('disabled') !== 'disabled') {
                    cy.wrap($input)
                        .clear()
                        .type(lastName);
                }
            }
        );
    }

    if (countryCode) {
        cy.get(fields.checkoutPageBillingAddressCountrySelectField).select(
            countryCode
        );
    }

    if (street1) {
        cy.get(fields.checkoutPageBillingAddressStreet1TextField)
            .clear()
            .type(street1);
    }

    if (street2) {
        cy.get(fields.checkoutPageBillingAddressStreet2TextField)
            .clear()
            .type(street2);
    }

    if (city) {
        cy.get(fields.checkoutPageBillingAddressCityTextField)
            .clear()
            .type(city);
    }

    if (regionId) {
        cy.get(fields.checkoutPageBillingAddressRegionField).select(regionId);
    } else if (region) {
        cy.get(fields.checkoutPageBillingAddressRegionField)
            .clear()
            .type(region);
    }

    if (postCode) {
        cy.get(fields.checkoutPageBillingAddressPostcodeTextField)
            .clear()
            .type(postCode);
    }

    if (telephone) {
        cy.get(fields.checkoutPageBillingAddressPhoneNumberTextField)
            .clear()
            .type(telephone);
    }

    cy.get(fields.checkoutPageOpenedDialogEditPaymentSubmitButton).click();
};

/**
 * Utility function to sign in guest user from CheckoutPage
 *
 * @param {String} [accountEmail] customer email
 * @param {String} accountPassword customer password
 */
export const signInFromCheckoutPage = (accountEmail, accountPassword) => {
    if (accountEmail) {
        cy.get(fields.checkoutPageSignInEmailTextField).type(accountEmail);
    }

    cy.get(fields.checkoutPageSignInPasswordField).type(accountPassword);

    cy.get(fields.checkoutPageSignInSubmitButton).click();
};
