import {
    accountAccess as accountAccessFixtures,
    forgotPasswordPage as forgotPasswordPageFixtures,
    googleReCaptchaApi as googleReCaptchaApiFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';

import { requestForgotPassword } from '../../../actions/forgotPasswordPage';

const { accountEmail } = accountAccessFixtures;

const { getReCaptchaV3ConfigCall, hitGraphqlPath } = graphqlMockedCallsFixtures;

const {
    forgotPasswordPageRoute,
    forgotPasswordFormAction
} = forgotPasswordPageFixtures;

const {
    websiteKey,
    defaultBadgePosition,
    inlineBadgePosition,
    languageCode,
    recaptchaToken,
    recaptchaWidgetId
} = googleReCaptchaApiFixtures;

describe(
    'verify Google ReCaptcha on forget password',
    {
        tags: ['@integration', '@commerce', '@open-source', '@ci', '@recaptcha']
    },
    () => {
        it('user can fill and submit form with default badge position', () => {
            // Prevent default Google ReCaptcha API from loading
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigDefault.json'
            }).as('gqlGetReCaptchaV3ConfigDefaultQuery');
            cy.intercept('POST', hitGraphqlPath, req => {
                if (
                    req.body.operationName.includes('requestPasswordResetEmail')
                ) {
                    req.reply({
                        fixture: 'forgotPasswordPage/forgotPassword.json'
                    });
                    req.alias = 'gqlRequestPasswordResetEmailMutation';
                }
            });

            cy.visit(forgotPasswordPageRoute);
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
                        execute: (key, action) => {
                            expect(key).to.eql(websiteKey);
                            expect(action).to.eql({
                                action: forgotPasswordFormAction
                            });

                            return recaptchaToken;
                        }
                    };

                    win['onloadRecaptchaCallback']();
                })
                .should('have.property', 'grecaptcha');

            // Test - Request forgot password
            requestForgotPassword({ email: accountEmail });

            // Test - Mutation headers
            cy.wait('@gqlRequestPasswordResetEmailMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
        });

        it('user can fill and submit form with inline badge position', () => {
            // Prevent default Google ReCaptcha API from loading
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigInline.json'
            }).as('gqlGetReCaptchaV3ConfigInlineQuery');
            cy.intercept('POST', hitGraphqlPath, req => {
                if (
                    req.body.operationName.includes('requestPasswordResetEmail')
                ) {
                    req.reply({
                        fixture: 'forgotPasswordPage/forgotPassword.json'
                    });
                    req.alias = 'gqlRequestPasswordResetEmailMutation';
                }
            });

            cy.visit(forgotPasswordPageRoute);
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
                        execute: (widgetId, action) => {
                            expect(widgetId).to.eql(recaptchaWidgetId);
                            expect(action).to.eql({
                                action: forgotPasswordFormAction
                            });

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

            // Test - Request forgot password
            requestForgotPassword({ email: accountEmail });

            // Test - Mutation headers
            cy.wait('@gqlRequestPasswordResetEmailMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
        });
    }
);
