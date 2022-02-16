import {
    checkoutPageShippingCard,
    checkoutPageSelectedShippingMethod,
    checkoutPagePaymentInformation,
    checkoutPageItemsReview,
    checkoutPageHeaderText,
    checkoutPageSignInButton,
    checkoutPagePriceSummarySubtotalPrice,
    checkoutPagePriceSummaryTotalPrice,
    checkoutPagePriceSummaryTaxPrice,
    checkoutPagePriceSummaryShippingPrice,
    checkoutPageOrderSummaryCard,
    checkoutPageOrderConfirmationHeader,
    checkoutPageOrderConfirmationNumber,
    checkoutPagePriceSummaryDiscountSummary,
    checkoutPagePriceSummaryGiftCardSummary,
    orderConfirmationPage,
    checkoutPageOpenedDialogSubmitButton,
    checkoutPageShippingInformationTitle,
    checkoutPageShippingCustomerForm,
    checkoutPageShippingCustomerSubmitButton,
    checkoutPageBillingAddressSelectLabel,
    checkoutPageBillingAddressFields,
    checkoutPagePriceAdjustmentCouponSection,
    checkoutPagePriceAdjustmentsGiftCardSection,
    checkoutPagePriceAdjustmentsGiftOptionsSection,
    orderConfirmationPageAdditionalText,
    orderConfirmationPageItemsTotalQuantity,
    orderConfirmationPageShippingInformationHeading,
    orderConfirmationPageShippingMethodHeading
} from '../../fields/checkoutPage';
import {
    defaultShippingMethod,
    defaultShippingMethods
} from '../../fixtures/checkoutPage';
import { validateLanguage } from '../../utils/language-test-utils';

/**
 * Utility function to assert Address is in Shipping Information
 *
 * @param {Object} data address data
 * @param {String} [data.email] email
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
        email,
        firstName,
        middleName,
        lastName,
        street1,
        street2,
        city,
        postCode,
        telephone,
        region,
        countryCode
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
    if (email) {
        cy.get(container).should('contain', email);
    }
    if (street2) {
        cy.get(container).should('contain', street2);
    }
    cy.get(container).should('contain', city);
    cy.get(container).should('contain', postCode);
    cy.get(container).should('contain', region);
    cy.get(container).should('contain', countryCode);
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
 * Utility function to assert correct Billing Address on CheckoutPage
 *
 * @param {Object} data billing address data
 * @param {String} data.firstName first name
 * @param {String} data.lastName last name
 * @param {String} data.street1 street 1
 * @param {String} [data.street2] street 2
 * @param {String} data.city city name
 * @param {String} data.region region text
 * @param {String} data.countryCode country code
 * @param {String} data.postCode post code
 */
export const assertBillingInformationInCheckoutPage = ({
    firstName,
    lastName,
    street1,
    street2,
    city,
    region,
    countryCode,
    postCode
}) => {
    cy.get(checkoutPagePaymentInformation).should('contain', firstName);
    cy.get(checkoutPagePaymentInformation).should('contain', lastName);
    cy.get(checkoutPagePaymentInformation).should('contain', street1);
    if (street2) {
        cy.get(checkoutPagePaymentInformation).should('contain', street2);
    }
    cy.get(checkoutPagePaymentInformation).should('contain', city);
    cy.get(checkoutPagePaymentInformation).should('contain', region);
    cy.get(checkoutPagePaymentInformation).should('contain', countryCode);
    cy.get(checkoutPagePaymentInformation).should('contain', postCode);
};

/**
 * Utility function to assert Product is in Checkout Page
 *
 * @param {Object} data Product's data
 * @param {String} data.name Product's name
 * @param {String} [data.color] Product's color
 * @param {String} [data.size] Product's size
 * @param {String|Number} [data.quantity] Product's quantity
 * @param {Boolean} [isOrderConfirmationPage] checks in Order Confirmation Page
 */
export const assertProductInCheckoutPage = (
    { name, color, size, quantity },
    isOrderConfirmationPage = false
) => {
    const container = isOrderConfirmationPage
        ? orderConfirmationPage
        : checkoutPageItemsReview;

    cy.get(container).should('contain', name);

    if (color) {
        cy.get(container).should('contain', color);
    }
    if (size) {
        cy.get(container).should('contain', size);
    }
    if (quantity) {
        cy.get(container).should('contain', quantity);
    }
};

/**
 * Utility function to assert if CheckoutPage has correct header
 * for guest customers
 */
export const assertCheckoutHasGuestHeader = () => {
    cy.get(checkoutPageHeaderText).should('have.text', 'Guest Checkout');
};

/**
 * Utility function to assert if SignIn button is present in CheckoutPage
 */
export const assertSignInButtonExists = () => {
    cy.get(checkoutPageSignInButton).should('exist');
};

/**
 * Utility function to assert if SignIn button is not present in CheckoutPage
 */
export const assertSignInButtonNotExist = () => {
    cy.get(checkoutPageSignInButton).should('not.exist');
};

/**
 * Utility function to assert OrderSummary is present in CheckoutPage
 * @param {String} [shippingMethod]
 */
export const assertOrderSummaryInCheckoutPage = (
    shippingMethod = defaultShippingMethod
) => {
    cy.get(checkoutPageOrderSummaryCard).should('contain', shippingMethod);
    cy.get(checkoutPagePriceSummarySubtotalPrice).should('exist');
    cy.get(checkoutPagePriceSummaryTotalPrice).should('exist');
    cy.get(checkoutPagePriceSummaryShippingPrice).should('exist');
    cy.get(checkoutPagePriceSummaryTaxPrice).should('exist');
};

export const assertOrderConfirmationHeadingInCheckoutPage = () => {
    cy.get(checkoutPageOrderConfirmationHeader).should('exist');
    cy.get(checkoutPageOrderConfirmationNumber).should($orderNumber => {
        expect($orderNumber.text()).to.match(/(order\snumber:)\s\d+/gi);
    });
};

export const assertUpdateDataButtonIsVisible = () => {
    cy.get(checkoutPageOpenedDialogSubmitButton).should($updateButton => {
        expect($updateButton).to.be.visible;
    });
};

/**
 * Utility function to assert ShippingInformation section text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertShippingInformationTextLanguage = language => {
    const textToValidate = [];
    cy.get(checkoutPageShippingInformationTitle).then($title =>
        textToValidate.push($title.text())
    );
    cy.get(checkoutPageShippingCustomerForm).within(() => {
        cy.get('label').then($label => textToValidate.push($label.text()));
        cy.get('p').then($p => textToValidate.push($p.text()));
    });
    cy.get(checkoutPageShippingCustomerSubmitButton).then($button => {
        textToValidate.push($button.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};

/**
 * Utility function to assert PaymentInformation section text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertPaymentInformationTextLanguage = language => {
    const textToValidate = [];
    cy.get(checkoutPageBillingAddressSelectLabel).then($label =>
        textToValidate.push($label.text())
    );
    cy.get(checkoutPageBillingAddressFields).within(() => {
        cy.get('label').then($label => {
            textToValidate.push($label.text());
            expect(validateLanguage(textToValidate.join(','), language)).to.be
                .true;
        });
    });
};

/**
 * Utility function to assert PriceAdjustments section text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertPriceAdjustmentsTextLanguage = language => {
    const textToValidate = [];
    cy.get(checkoutPagePriceAdjustmentCouponSection).within(() => {
        cy.get('label').then($label => textToValidate.push($label.text()));
        cy.get('button').then($button => textToValidate.push($button.text()));
    });
    cy.get(checkoutPagePriceAdjustmentsGiftCardSection).within(() => {
        cy.get('label').then($label => textToValidate.push($label.text()));
        cy.get('button').then($button => textToValidate.push($button.text()));
    });
    cy.get(checkoutPagePriceAdjustmentsGiftOptionsSection).within(() => {
        cy.get('label').then($label => {
            textToValidate.push($label.text());
            expect(validateLanguage(textToValidate.join(','), language)).to.be
                .true;
        });
    });
};

/**
 * Utility function to assert OrderConfirmationPage text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertOrderConfirmationPageTextLanguage = language => {
    const textToValidate = [];
    cy.get(checkoutPageOrderConfirmationHeader).then($header =>
        textToValidate.push($header.text())
    );
    cy.get(checkoutPageOrderConfirmationNumber).then($number =>
        textToValidate.push($number.text().replace(/\d:/, ''))
    );
    cy.get(orderConfirmationPageShippingInformationHeading).then($heading =>
        textToValidate.push($heading.text())
    );
    cy.get(orderConfirmationPageShippingMethodHeading).then($heading =>
        textToValidate.push($heading.text())
    );
    cy.get(orderConfirmationPageItemsTotalQuantity).then($quantity =>
        textToValidate.push($quantity.text().replace(/\d/, ''))
    );
    cy.get(orderConfirmationPageAdditionalText).then($text => {
        textToValidate.push($text.text());
        expect(validateLanguage(textToValidate.join(','), language)).to.be.true;
    });
};

/**
 * Utility function to assert prices in CheckoutPage displays correct currency.
 *
 * @param {String} currency -- currency code to validate
 */
export const assertCheckoutPageHasCurrency = currency => {
    const currencySymbolMap = {
        USD: '$',
        EUR: '€'
    };
    cy.get(checkoutPagePriceSummarySubtotalPrice).should(
        'contain',
        currencySymbolMap[currency]
    );
    cy.get(checkoutPagePriceSummaryTotalPrice).should(
        'contain',
        currencySymbolMap[currency]
    );
};
