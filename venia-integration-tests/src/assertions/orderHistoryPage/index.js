import {
    orderHistoryTable,
    orderDetailsBillingInformation,
    orderDetailsItems,
    orderDetailsPaymentMethod,
    orderDetailsShippingInformation,
    orderDetailsShippingMethod
} from '../../fields/orderHistoryPage';
import {
    defaultPaymentMethod,
    defaultShippingMethods
} from '../../fixtures/checkoutPage';

/**
 * Utility function to assert number of orders in table
 *
 * @param {Number} count
 */
export const assertOrdersCountInOrderDetails = count => {
    cy.get(orderHistoryTable).should('have.lengthOf', count);
};

/**
 * Utility function to assert address in Shipping or Billing Information
 *
 * @param {Object} data address data
 * @param {String} data.firstName first name
 * @param {String} data.lastName last name
 * @param {String} data.street1 street 1
 * @param {String} [data.street2] street 2
 * @param {String} data.city city
 * @param {String} data.postCode postal code
 * @param {Boolean} [isBillingInformation] checks in Billing Information
 */
export const assertAddressInformationInOrderDetails = (
    { firstName, lastName, street1, street2, city, postCode },
    isBillingInformation = false
) => {
    const container = isBillingInformation
        ? orderDetailsBillingInformation
        : orderDetailsShippingInformation;
    const fullName = `${firstName} ${lastName}`;

    cy.get(container).should('contain', fullName);
    cy.get(container).should('contain', street1);
    cy.get(container).should('contain', street1);
    if (street2) {
        cy.get(container).should('contain', street2);
    }
    cy.get(container).should('contain', city);
    cy.get(container).should('contain', postCode);
};

/**
 * Utility function to assert Shipping Method
 *
 * @param {String} [shippingMethodLabel]
 */
export const assertShippingMethodInOrderDetails = (
    shippingMethodLabel = defaultShippingMethods.free.label
) => {
    cy.get(orderDetailsShippingMethod).should('contain', shippingMethodLabel);
};

/**
 * Utility function to assert Payment Method
 *
 * @param {String} name
 */
export const assertPaymentMethodInOrderDetails = (
    name = defaultPaymentMethod
) => {
    cy.get(orderDetailsPaymentMethod).should('contain', name);
};

/**
 * Utility function to assert Product is in Order Details
 *
 * @param {String} name Product's name
 */
export const assertProductInOrderDetails = name => {
    cy.get(orderDetailsItems).should('contain', name);
};
