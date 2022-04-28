import {
    accountAccess as accountAccessFixtures,
    accountInformationPage as accountInformationPageFixtures,
    googleReCaptchaApi as googleReCaptchaApiFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';

import { accountInformationPage as accountInformationPageActions } from '../../../actions';

const {
    accountEmail,
    createAccountFormAction,
    firstName,
    lastName,
    accountPassword,
    signInFormAction
} = accountAccessFixtures;

const { editAccountInformationFormAction } = accountInformationPageFixtures;

const {
    getReCaptchaV3ConfigCall,
    hitGraphqlPath,
    getCustomerInfoCall
} = graphqlMockedCallsFixtures;

const {
    websiteKey,
    defaultBadgePosition,
    inlineBadgePosition,
    languageCode,
    recaptchaToken,
    recaptchaWidgetId
} = googleReCaptchaApiFixtures;

const {
    openAccountInformationEditModal,
    editAccountInformationPassword
} = accountInformationPageActions;

describe(
    'Verify Google ReCaptcha for Account Information changes',
    {
        tags: ['@integration', '@commerce', '@open-source', '@ci', '@recaptcha']
    },
    () => {
        it('user can edit account information with default badge position', () => {
            // Prevent default Google ReCaptcha API from loading
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigDefault.json'
            }).as('gqlGetReCaptchaV3ConfigDefaultQuery');
            cy.intercept('GET', getCustomerInfoCall, {
                fixture: 'accountInformationPage/customerInformation.json'
            }).as('gqlGetCustomerInfoQuery');

            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('CreateAccount')) {
                    req.reply({
                        fixture: 'accountAccess/createAccount.json'
                    });
                    req.alias = 'gqlCreateAccountMutation';
                    return;
                }
                if (req.body.operationName.includes('SignInAfterCreate')) {
                    req.reply({
                        fixture: 'accountAccess/signIn.json'
                    });
                    req.alias = 'gqlSignInAfterCreateMutation';
                    return;
                }
                if (req.body.operationName.includes('ChangeCustomerPassword')) {
                    req.reply({
                        fixture: 'accountInformationPage/changePassword.json'
                    });
                    req.alias = 'gqlChangeCustomerPasswordMutation';
                }
            });

            cy.visitHomePage();
            cy.toggleLoginDialog();

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
                                action: createAccountFormAction
                            });

                            return recaptchaToken;
                        }
                    };

                    win['onloadRecaptchaCallback']();
                })
                .should('have.property', 'grecaptcha');

            // Create Account and signIn
            cy.createAccount(
                firstName,
                lastName,
                accountEmail,
                accountPassword
            );

            cy.wait(
                ['@gqlCreateAccountMutation', '@gqlSignInAfterCreateMutation'],
                {
                    timeout: 60000
                }
            );

            cy.visitAccountInfoPage();

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

            cy.window()
                .then(win => {
                    // Create a Google ReCaptcha API Mock window object
                    win.grecaptcha = {
                        execute: (key, action) => {
                            expect(key).to.eql(websiteKey);
                            expect(action).to.eql({
                                action: editAccountInformationFormAction
                            });

                            return recaptchaToken;
                        }
                    };
                    win['onloadRecaptchaCallback']();
                })
                .should('have.property', 'grecaptcha');

            // Test - Edit customer password
            openAccountInformationEditModal();
            editAccountInformationPassword(
                accountPassword,
                `${accountPassword}z@8H`
            );

            cy.wait('@gqlChangeCustomerPasswordMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
        });

        it('user can edit account information with inline badge position', () => {
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigInline.json'
            }).as('gqlGetReCaptchaV3ConfigInlineQuery');
            cy.intercept('GET', getCustomerInfoCall, {
                fixture: 'accountInformationPage/customerInformation.json'
            }).as('gqlGetCustomerInfoQuery');

            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('SignIn')) {
                    req.reply({
                        fixture: 'accountAccess/signIn.json'
                    });
                    req.alias = 'gqlSignInMutation';
                    return;
                }
                if (req.body.operationName.includes('ChangeCustomerPassword')) {
                    req.reply({
                        fixture: 'accountInformationPage/changePassword.json'
                    });
                    req.alias = 'gqlChangeCustomerPasswordMutation';
                }
            });

            cy.visitHomePage();
            cy.toggleLoginDialog();

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
                                action: signInFormAction
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

            // Sign in with previously created account
            cy.signInAccount(accountEmail, accountPassword);

            cy.wait('@gqlSignInMutation', {
                timeout: 60000
            });

            cy.visitAccountInfoPage();

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
                                action: editAccountInformationFormAction
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

            // Test - Edit customer password
            openAccountInformationEditModal();
            editAccountInformationPassword(
                accountPassword,
                `${accountPassword}z@8H`
            );

            cy.wait('@gqlChangeCustomerPasswordMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
        });
    }
);
