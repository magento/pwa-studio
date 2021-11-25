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
    forgotPasswordFormKey
} = forgotPasswordPageFixtures;

const {
    websiteKey,
    badgePosition,
    languageCode,
    recaptchaToken
} = googleReCaptchaApiFixtures;

describe('verify contact form', () => {
    it('user can fill and submit form', () => {
        // Prevent default Google ReCaptcha API from loading
        cy.intercept('https://www.google.com/recaptcha/api.js?*', {}).as(
            'googleReCaptchaApi'
        );
        cy.intercept('GET', getReCaptchaV3ConfigCall, {
            fixture: 'googleReCaptchaApi/reCaptchaV3Config.json'
        }).as('gqlGetReCaptchaV3ConfigQuery');
        cy.intercept('POST', hitGraphqlPath, req => {
            if (req.body.operationName.includes('requestPasswordResetEmail')) {
                req.reply({
                    fixture: 'forgotPasswordPage/forgotPassword.json'
                });
                req.alias = 'gqlRequestPasswordResetEmailMutation';
            }
        });

        cy.visit(forgotPasswordPageRoute);

        // Test - API Url params
        cy.wait(['@googleReCaptchaApi'])
            .its('response.url')
            .should('contain', `render=${websiteKey}`)
            .and('contain', `badge=${badgePosition}`)
            .and('contain', `hl=${languageCode}`);

        // Test - Received key and action
        cy.window().then(win => {
            // Create a Google ReCaptcha API Mock window object
            win.grecaptcha = {
                execute: (key, action) => {
                    expect(key).to.eql(websiteKey);
                    expect(action).to.eql({
                        action: forgotPasswordFormKey
                    });

                    return recaptchaToken;
                }
            };
        });

        // Test - Request forgot password
        requestForgotPassword({ email: accountEmail });

        // Test - Mutation headers
        cy.wait('@gqlRequestPasswordResetEmailMutation')
            .its('request.headers')
            .should('have.property', 'x-recaptcha', recaptchaToken);
    });
});
