import {
    homePage as homePageFixtures,
    googleReCaptchaApi as googleReCaptchaApiFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    productPage as productPageFixtures,
    checkoutPage as checkoutPageFixtures
} from '../../../fixtures';

import {
    addToCartFromProductPage,
    selectOptionsFromProductPage,
    setQuantityFromProductPage
} from '../../../actions/productPage';
import { aliasMutation } from '../../../utils/graphql-test-utils';
import { cartPageRoute } from '../../../fixtures/cartPage';
import {
    getAppliedGiftCardsCall,
    getCheckoutDetailsCall,
    getItemsInCartCall,
    getPaymentInformationCall,
    getProductListingCall,
    getSelectedAndAvailableShippingMethodsCall
} from '../../../fixtures/graphqlMockedCalls';
import { assertProductInCartPage } from '../../../assertions/cartPage';

import {
    editCreditCardInformation,
    placeOrder,
    reviewOrder,
    setGuestShippingAddress,
    submitShippingMethod
} from '../../../actions/checkoutPage';
import {
    assertAddressInShippingInformationInCheckoutPage,
    assertOrderConfirmationHeadingInCheckoutPage
} from '../../../assertions/checkoutPage';
import {
    braintreeFormAction,
    placeOrderFormAction
} from '../../../fixtures/checkoutPage';

const { assertCartIsEmpty, assertCartTriggerCount } = headerAssertions;
const { productValeriaTwoLayeredTank } = productPageFixtures;

const {
    getReCaptchaV3ConfigCall,
    hitGraphqlPath,
    getProductDetailForProductPageCall
} = graphqlMockedCallsFixtures;

const { homePage } = homePageFixtures;

import { header as headerAssertions } from '../../../assertions';
import { defaultBadgePosition } from '../../../fixtures/googleReCaptchaApi';
const { checkoutCustomer1, checkoutBillingData } = checkoutPageFixtures;

const {
    websiteKey,
    inlineBadgePosition,
    languageCode,
    recaptchaToken,
    recaptchaWidgetId
} = googleReCaptchaApiFixtures;

describe(
    'verify Google ReCaptcha in checkout',
    {
        tags: [
            '@integration',
            '@commerce',
            '@open-source',
            '@ci',
            '@recaptcha',
            '@checkout'
        ]
    },
    () => {
        it('user can fill and submit payment form and place order with inline badge position', () => {
            // Intercepts
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigInline.json'
            }).as('gqlGetReCaptchaV3ConfigInlineQuery');

            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.intercept('GET', getAppliedGiftCardsCall).as(
                'gqlGetAppliedGiftCardsQuery'
            );
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );
            cy.intercept('GET', getProductListingCall).as(
                'gqlGetProductListingQuery'
            );

            cy.intercept('GET', getSelectedAndAvailableShippingMethodsCall).as(
                'gqlGetSelectedAndAvailableShippingMethodsQuery'
            );
            cy.intercept('GET', getPaymentInformationCall).as(
                'gqlGetPaymentInformationQuery'
            );

            cy.intercept('GET', getCheckoutDetailsCall).as(
                'gqlGetCheckoutDetailsQuery'
            );

            cy.intercept('GET', getItemsInCartCall).as(
                'gqlGetItemsInCartQuery'
            );
            cy.intercept('GET', getCheckoutDetailsCall).as(
                'gqlGetCheckoutDetailsQuery'
            );

            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'UpdateConfigurableOptions');
                aliasMutation(req, 'SetGuestShipping');
                aliasMutation(req, 'SetShippingMethod');
                aliasMutation(req, 'placeOrder');

                if (
                    req.body.operationName.includes('setSelectedPaymentMethod')
                ) {
                    req.reply({
                        fixture: 'checkoutPage/paymentMethodSubmitValid.json'
                    });
                    req.alias = 'gqlSetSelectedPaymentMethodMutation';
                }

                if (req.body.operationName.includes('placeOrder')) {
                    req.reply({
                        fixture: 'checkoutPage/placeOrderSubmitValid.json'
                    });
                    req.alias = 'gqlPlaceOrderMutation';
                }
            });

            // Add product to cart
            cy.visitPage(homePage);

            assertCartIsEmpty();
            cy.visit(productValeriaTwoLayeredTank.url);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });

            selectOptionsFromProductPage();
            setQuantityFromProductPage(1);
            addToCartFromProductPage();
            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });

            assertCartTriggerCount(1);

            cy.visit(cartPageRoute);

            assertProductInCartPage(productValeriaTwoLayeredTank.name);

            // Go to checkout
            cy.visitCheckoutPage();

            /**
             * Recaptcha
             */
            cy.wait(['@gqlGetReCaptchaV3ConfigInlineQuery']).its(
                'response.body'
            );

            // Test - API Url params
            cy.wait(['@googleReCaptchaApi'])
                .its('response.url')
                .should('contain', `render=explicit`)
                .and('contain', `onload=onloadRecaptchaCallback`)
                .and('contain', `badge=${inlineBadgePosition}`)
                .and('contain', `hl=${languageCode}`);

            // Test - Mock Google ReCaptcha API
            cy.window()
                .then(win => {
                    // Create a Google ReCaptcha API Mock window object
                    win.grecaptcha = {
                        execute: (widgetId, { action }) => {
                            expect(widgetId).to.eql(recaptchaWidgetId);
                            expect(action).to.be.oneOf([
                                braintreeFormAction,
                                placeOrderFormAction
                            ]);

                            return recaptchaToken;
                        },
                        render: (inlineContainer, { sitekey, size }) => {
                            expect(sitekey).to.eql(websiteKey);
                            expect(size).to.eql('invisible');

                            return recaptchaWidgetId;
                        }
                    };

                    win['onloadRecaptchaCallback']();
                })
                .should('have.property', 'grecaptcha');

            setGuestShippingAddress(checkoutCustomer1);
            cy.wait(['@gqlGetSelectedAndAvailableShippingMethodsQuery'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(checkoutCustomer1);
            submitShippingMethod();
            cy.wait(
                [
                    '@gqlSetShippingMethodMutation',
                    '@gqlGetPaymentInformationQuery'
                ],
                { timeout: 60000 }
            );

            editCreditCardInformation({ ...checkoutBillingData[0] });

            reviewOrder();

            // Verify that recaptcha token was passed in headers
            cy.wait('@gqlSetSelectedPaymentMethodMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);

            placeOrder();

            cy.wait(['@gqlGetCheckoutDetailsQuery'], {
                timeout: 60000
            });

            cy.wait('@gqlPlaceOrderMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);

            assertOrderConfirmationHeadingInCheckoutPage();
        });

        it('user can fill and submit payment form and place order with default badge position', () => {
            // Intercepts
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigDefault.json'
            }).as('gqlGetReCaptchaV3ConfigDefaultQuery');

            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );

            cy.intercept('GET', getAppliedGiftCardsCall).as(
                'gqlGetAppliedGiftCardsQuery'
            );
            cy.intercept('GET', getProductDetailForProductPageCall).as(
                'gqlGetProductDetailForProductPageQuery'
            );
            cy.intercept('GET', getProductListingCall).as(
                'gqlGetProductListingQuery'
            );

            cy.intercept('GET', getSelectedAndAvailableShippingMethodsCall).as(
                'gqlGetSelectedAndAvailableShippingMethodsQuery'
            );
            cy.intercept('GET', getPaymentInformationCall).as(
                'gqlGetPaymentInformationQuery'
            );

            cy.intercept('GET', getCheckoutDetailsCall).as(
                'gqlGetCheckoutDetailsQuery'
            );

            cy.intercept('GET', getItemsInCartCall).as(
                'gqlGetItemsInCartQuery'
            );
            cy.intercept('GET', getCheckoutDetailsCall).as(
                'gqlGetCheckoutDetailsQuery'
            );

            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'UpdateConfigurableOptions');
                aliasMutation(req, 'SetGuestShipping');
                aliasMutation(req, 'SetShippingMethod');
                aliasMutation(req, 'placeOrder');

                if (
                    req.body.operationName.includes('setSelectedPaymentMethod')
                ) {
                    req.reply({
                        fixture: 'checkoutPage/paymentMethodSubmitValid.json'
                    });
                    req.alias = 'gqlSetSelectedPaymentMethodMutation';
                }

                if (req.body.operationName.includes('placeOrder')) {
                    req.reply({
                        fixture: 'checkoutPage/placeOrderSubmitValid.json'
                    });
                    req.alias = 'gqlPlaceOrderMutation';
                }
            });

            // Add product to cart
            cy.visitPage(homePage);

            assertCartIsEmpty();
            cy.visit(productValeriaTwoLayeredTank.url);
            cy.wait(['@gqlGetProductDetailForProductPageQuery'], {
                timeout: 60000
            });

            selectOptionsFromProductPage();
            setQuantityFromProductPage(1);
            addToCartFromProductPage();
            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });

            assertCartTriggerCount(1);

            cy.visit(cartPageRoute);

            assertProductInCartPage(productValeriaTwoLayeredTank.name);

            // Go to checkout
            cy.visitCheckoutPage();

            /**
             * Recaptcha
             */
            cy.wait(['@gqlGetReCaptchaV3ConfigDefaultQuery']).its(
                'response.body'
            );

            // Test - API Url params
            cy.wait(['@googleReCaptchaApi'])
                .its('response.url')
                .should('contain', `render=${websiteKey}`)
                .and('contain', `onload=onloadRecaptchaCallback`)
                .and('contain', `badge=${defaultBadgePosition}`)
                .and('contain', `hl=${languageCode}`);

            // Test - Create fake floating badge
            cy.document()
                .then($document => {
                    const floatingBadge = $document.createElement('div');
                    floatingBadge.className = 'grecaptcha-badge';
                    $document.body.append(floatingBadge);
                })
                .get('.grecaptcha-badge')
                .should('exist');

            // Test - Mock Google ReCaptcha API
            cy.window()
                .then(win => {
                    // Create a Google ReCaptcha API Mock window object
                    win.grecaptcha = {
                        execute: (key, { action }) => {
                            expect(key).to.eql(websiteKey);
                            expect(action).to.be.oneOf([
                                braintreeFormAction,
                                placeOrderFormAction
                            ]);

                            return recaptchaToken;
                        }
                    };

                    win['onloadRecaptchaCallback']();
                })
                .should('have.property', 'grecaptcha');

            setGuestShippingAddress(checkoutCustomer1);
            cy.wait(['@gqlGetSelectedAndAvailableShippingMethodsQuery'], {
                timeout: 60000
            });

            assertAddressInShippingInformationInCheckoutPage(checkoutCustomer1);
            submitShippingMethod();
            cy.wait(
                [
                    '@gqlSetShippingMethodMutation',
                    '@gqlGetPaymentInformationQuery'
                ],
                { timeout: 60000 }
            );

            editCreditCardInformation({ ...checkoutBillingData[0] });

            reviewOrder();

            // Verify that recaptcha token was passed in headers
            cy.wait('@gqlSetSelectedPaymentMethodMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);

            placeOrder();

            cy.wait(['@gqlGetCheckoutDetailsQuery'], {
                timeout: 60000
            });

            cy.wait('@gqlPlaceOrderMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);

            assertOrderConfirmationHeadingInCheckoutPage();
        });
    }
);
