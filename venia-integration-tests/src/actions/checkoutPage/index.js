import {
    checkoutPageSignInButton,
    checkoutPageShippingGuestEmailTextField,
    checkoutPageShippingGuestFirstNameTextField,
    checkoutPageShippingGuestLastNameTextField,
    checkoutPageShippingGuestCountrySelect,
    checkoutPageShippingGuestStreet1TextField,
    checkoutPageShippingGuestStreet2TextField,
    checkoutPageShippingGuestCityTextField,
    checkoutPageShippingGuestRegionField,
    checkoutPageShippingGuestPostCodeTextField,
    checkoutPageShippingGuestTelephoneTextField,
    checkoutPageShippingGuestSubmitButton,
    checkoutPageShippingCustomerFirstNameTextField,
    checkoutPageShippingCustomerLastNameTextField,
    checkoutPageShippingCustomerCountrySelect,
    checkoutPageShippingCustomerStreet1TextField,
    checkoutPageShippingCustomerStreet2TextField,
    checkoutPageShippingCustomerCityTextField,
    checkoutPageShippingCustomerRegionField,
    checkoutPageShippingCustomerPostCodeTextField,
    checkoutPageShippingCustomerTelephoneTextField,
    checkoutPageShippingCustomerSubmitButton,
    checkoutPageCreditCardCardholderName,
    checkoutPageCreditCardCardFrame,
    checkoutPageCreditCardFrameCardNumberField,
    checkoutPageCreditCardExpirationFrame,
    checkoutPageCreditCardFrameExpirationField,
    checkoutPageCreditCardCodeFrame,
    checkoutPageCreditCardFrameCodeField,
    checkoutPageReviewOrderButton,
    checkoutPagePlaceOrderButton,
    orderConfirmationCreateAccountFirstNameTextField,
    orderConfirmationCreateAccountLastNameTextField,
    orderConfirmationCreateAccountEmailTextField,
    orderConfirmationCreateAccountPasswordTextField,
    orderConfirmationCreateAccountNewsletterCheckbox,
    orderConfirmationCreateAccountCreateAccountButton
} from '../../fields/checkoutPage';

export const toggleLoginDialog = () => {
    cy.get(checkoutPageSignInButton).click();
};

export const reviewOrder = () => {
    cy.get(checkoutPageReviewOrderButton).click();
};

export const placeOrder = () => {
    cy.get(checkoutPagePlaceOrderButton).click();
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
        cy.get(checkoutPageShippingGuestEmailTextField)
            .clear()
            .type(email);
    }

    if (firstName) {
        cy.get(checkoutPageShippingGuestFirstNameTextField)
            .clear()
            .type(firstName);
    }

    if (lastName) {
        cy.get(checkoutPageShippingGuestLastNameTextField)
            .clear()
            .type(lastName);
    }

    if (countryCode) {
        cy.get(checkoutPageShippingGuestCountrySelect).select(countryCode);
    }

    if (street1) {
        cy.get(checkoutPageShippingGuestStreet1TextField)
            .clear()
            .type(street1);
    }

    if (street2) {
        cy.get(checkoutPageShippingGuestStreet2TextField)
            .clear()
            .type(street2);
    }

    if (city) {
        cy.get(checkoutPageShippingGuestCityTextField)
            .clear()
            .type(city);
    }

    if (regionId) {
        cy.get(checkoutPageShippingGuestRegionField).select(regionId);
    } else if (region) {
        cy.get(checkoutPageShippingGuestRegionField)
            .clear()
            .type(region);
    }

    if (postCode) {
        cy.get(checkoutPageShippingGuestPostCodeTextField)
            .clear()
            .type(postCode);
    }

    if (telephone) {
        cy.get(checkoutPageShippingGuestTelephoneTextField)
            .clear()
            .type(telephone);
    }

    cy.get(checkoutPageShippingGuestSubmitButton).click();
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
        cy.get(checkoutPageShippingCustomerFirstNameTextField).then($input => {
            if ($input.attr('disabled') !== 'disabled') {
                cy.wrap($input)
                    .clear()
                    .type(firstName);
            }
        });
    }

    if (lastName) {
        cy.get(checkoutPageShippingCustomerLastNameTextField).then($input => {
            if ($input.attr('disabled') !== 'disabled') {
                cy.wrap($input)
                    .clear()
                    .type(lastName);
            }
        });
    }

    if (countryCode) {
        cy.get(checkoutPageShippingCustomerCountrySelect).select(countryCode);
    }

    if (street1) {
        cy.get(checkoutPageShippingCustomerStreet1TextField)
            .clear()
            .type(street1);
    }

    if (street2) {
        cy.get(checkoutPageShippingCustomerStreet2TextField)
            .clear()
            .type(street2);
    }

    if (city) {
        cy.get(checkoutPageShippingCustomerCityTextField)
            .clear()
            .type(city);
    }

    if (regionId) {
        cy.get(checkoutPageShippingCustomerRegionField).select(regionId);
    } else if (region) {
        cy.get(checkoutPageShippingCustomerRegionField)
            .clear()
            .type(region);
    }

    if (postCode) {
        cy.get(checkoutPageShippingCustomerPostCodeTextField)
            .clear()
            .type(postCode);
    }

    if (telephone) {
        cy.get(checkoutPageShippingCustomerTelephoneTextField)
            .clear()
            .type(telephone);
    }

    cy.get(checkoutPageShippingCustomerSubmitButton).click();
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
    cy.get(checkoutPageCreditCardCardholderName)
        .clear()
        .type(name);

    cy.getIframeBody(checkoutPageCreditCardCardFrame)
        .find(checkoutPageCreditCardFrameCardNumberField)
        .clear()
        .type(number);

    cy.getIframeBody(checkoutPageCreditCardExpirationFrame)
        .find(checkoutPageCreditCardFrameExpirationField)
        .clear()
        .type(expiration);

    cy.getIframeBody(checkoutPageCreditCardCodeFrame)
        .find(checkoutPageCreditCardFrameCodeField)
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
        cy.get(orderConfirmationCreateAccountFirstNameTextField)
            .clear()
            .type(firstName);
    }

    if (lastName) {
        cy.get(orderConfirmationCreateAccountLastNameTextField)
            .clear()
            .type(lastName);
    }

    if (email) {
        cy.get(orderConfirmationCreateAccountEmailTextField)
            .clear()
            .type(email);
    }

    cy.get(orderConfirmationCreateAccountPasswordTextField)
        .clear()
        .type(password);

    if (isSubscribed) {
        cy.get(orderConfirmationCreateAccountNewsletterCheckbox).check();
    } else {
        cy.get(orderConfirmationCreateAccountNewsletterCheckbox).uncheck();
    }

    cy.get(orderConfirmationCreateAccountCreateAccountButton).click();
};
