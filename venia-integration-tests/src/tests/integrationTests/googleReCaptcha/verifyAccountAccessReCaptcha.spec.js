import {
    accountAccess as accountAccessFixtures,
    googleReCaptchaApi as googleReCaptchaApiFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';

const {
    accountEmail,
    createAccountFormAction,
    firstName,
    lastName,
    accountPassword,
    signInFormAction
} = accountAccessFixtures;

const { getReCaptchaV3ConfigCall, hitGraphqlPath } = graphqlMockedCallsFixtures;

const {
    websiteKey,
    defaultBadgePosition,
    inlineBadgePosition,
    languageCode,
    recaptchaToken,
    recaptchaWidgetId
} = googleReCaptchaApiFixtures;

describe(
    'verify Google ReCaptcha for AccountAccess',
    {
        tags: ['@integration', '@commerce', '@open-source', '@ci', '@recaptcha']
    },
    () => {
        it('user can create account with default badge position', () => {
            // Prevent default Google ReCaptcha API from loading
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigDefault.json'
            }).as('gqlGetReCaptchaV3ConfigDefaultQuery');
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

            // Test - Create Account and signIn
            cy.createAccount(
                firstName,
                lastName,
                accountEmail,
                accountPassword
            );

            // Test - Mutation headers
            cy.wait('@gqlCreateAccountMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);

            cy.wait('@gqlSignInAfterCreateMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
        });

        it('user can sign in with default badge position', () => {
            // Prevent default Google ReCaptcha API from loading
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );

            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('SignIn')) {
                    req.reply({
                        fixture: 'accountAccess/signIn.json'
                    });
                    req.alias = 'gqlSignInMutation';
                }
            });
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigDefault.json'
            }).as('gqlGetReCaptchaV3ConfigDefaultQuery');

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
                                action: signInFormAction
                            });

                            return recaptchaToken;
                        }
                    };

                    win['onloadRecaptchaCallback']();
                })
                .should('have.property', 'grecaptcha');

            // Test - sign in with previously created account
            cy.signInAccount(accountEmail, accountPassword);

            cy.wait('@gqlSignInMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
        });

        it('user can create account with inline badge position', () => {
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
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
                }
            });
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigInline.json'
            }).as('gqlGetReCaptchaV3ConfigInlineQuery');

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
                                action: createAccountFormAction
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

            // Test - CreateAccout with different email
            cy.createAccount(
                firstName,
                lastName,
                `${Cypress._.random(0, 1e6)}test@example.com`,
                accountPassword
            );

            // Test - Mutation headers
            cy.wait('@gqlCreateAccountMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
            cy.wait('@gqlSignInAfterCreateMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
        });

        it('user can sign in inline badge position', () => {
            cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
                'googleReCaptchaApi'
            );
            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('SignIn')) {
                    req.reply({
                        fixture: 'accountAccess/signIn.json'
                    });
                    req.alias = 'gqlSignInMutation';
                }
            });
            cy.intercept('GET', getReCaptchaV3ConfigCall, {
                fixture: 'googleReCaptchaApi/reCaptchaV3ConfigInline.json'
            }).as('gqlGetReCaptchaV3ConfigInlineQuery');

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

            // Test sign in
            cy.signInAccount(accountEmail, accountPassword);

            cy.wait('@gqlSignInMutation')
                .its('request.headers')
                .should('have.property', 'x-recaptcha', recaptchaToken);
        });
    }
);
