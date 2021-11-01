import {
    checkoutPageShippingCard,
    checkoutPageSelectedShippingMethod,
    checkoutPagePaymentInformation,
    checkoutPageItemsReview,
    checkoutPagePriceSummaryDiscountSummary,
    checkoutPagePriceSummaryGiftCardSummary,
    orderConfirmationPage
} from '../../fields/checkoutPage';
import { defaultShippingMethods } from '../../fixtures/checkoutPage';

/**
 * Utility function to assert Address is in Shipping Information
 *
 * @param {Object} data address data
 * @param {String} data.firstName first name
 * @param {String} [data.middleName] middle name
 * @param {String} data.lastName last name
 * @param {String} data.street1 street 1
 * @param {String} [data.street2] street 2
 * @param {String} data.city city
 * @param {String} data.postCode postal code
 * @param {String} data.telephone phone number
 * @param {Boolean} [isOrderConfirmationPage] checks in Order Confirmation Page
 */
export const assertAddressInShippingInformationInCheckoutPage = (
    {
        firstName,
        middleName,
        lastName,
        street1,
        street2,
        city,
        postCode,
        telephone
    },
    isOrderConfirmationPage = false
) => {
    const container = isOrderConfirmationPage
        ? orderConfirmationPage
        : checkoutPageShippingCard;
    const fullName = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;

    cy.get(container).should('contain', fullName);
    cy.get(container).should('contain', street1);
    cy.get(container).should('contain', street1);
    if (street2) {
        cy.get(container).should('contain', street2);
    }
    cy.get(container).should('contain', city);
    cy.get(container).should('contain', postCode);
    if (!isOrderConfirmationPage) {
        cy.get(container).should('contain', telephone);
    }
};

/**
 * Utility function to assert a Coupon Code is applied
 */
export const assertAppliedCouponCodeInCheckoutPage = () => {
    cy.get(checkoutPagePriceSummaryDiscountSummary).should('exist');
};

/**
 * Utility function to assert a Gift Card is applied
 */
export const assertAppliedGiftCardInCheckoutPage = () => {
    cy.get(checkoutPagePriceSummaryGiftCardSummary).should('exist');
};

/**
 * Utility function to assert selected Shipping Method
 *
 * @param {String} [shippingMethodLabel]
 * @param {Boolean} [isOrderConfirmationPage] checks in Order Confirmation Page
 */
export const assertSelectedShippingMethodInCheckoutPage = (
    shippingMethodLabel = defaultShippingMethods.free.label,
    isOrderConfirmationPage = false
) => {
    const container = isOrderConfirmationPage
        ? orderConfirmationPage
        : checkoutPageSelectedShippingMethod;

    cy.get(container).should('contain', shippingMethodLabel);
};

/**
 * Utility function to assert Payment Information
 *
 * @param {String} shortDescription
 */
export const assertPaymentInformationInCheckoutPage = ({
    shortDescription
}) => {
    cy.get(checkoutPagePaymentInformation).should('contain', shortDescription);
};

/**
 * Utility function to assert Product is in Checkout Page
 *
 * @param {String} name Product's name
 * @param {Boolean} [isOrderConfirmationPage] checks in Order Confirmation Page
 */
export const assertProductInCheckoutPage = (
    name,
    isOrderConfirmationPage = false
) => {
    const container = isOrderConfirmationPage
        ? orderConfirmationPage
        : checkoutPageItemsReview;

    cy.get(container).should('contain', name);
};
