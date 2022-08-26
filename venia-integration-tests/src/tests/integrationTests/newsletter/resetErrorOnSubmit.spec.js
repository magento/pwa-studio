import {
    newsletter as newsletterFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    homePage as homePageFixtures
} from '../../../fixtures';

import {
    fillNewsletterForm,
    submitNewsLetterForm
} from '../../../actions/newsletter';

import { newsletterRoot } from '../../../fields/newsletter';

const { hitGraphqlPath } = graphqlMockedCallsFixtures;

describe(
    'verify newsletter form',
    { tags: ['@integration', '@commerce', '@open-source', '@ci'] },
    () => {
        it('Validate validations', () => {
            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('subscribeToNewsletter')) {
                    req.reply({
                        fixture: 'newsletter/newsletterFormSubmitError.json'
                    });
                }
            }).as('submitErrorNewsletterForm');

            cy.visit(homePageFixtures.homePage);
            // Check input validation
            fillNewsletterForm();
            submitNewsLetterForm();
            cy.get(newsletterRoot).should(
                'contain.text',
                newsletterFixtures.requiredValidation
            );
            // Check email validation and no input validation
            fillNewsletterForm(newsletterFixtures.invalidEmail);
            submitNewsLetterForm();
            cy.wait(['@submitErrorNewsletterForm']).its('response.body');
            cy.get(newsletterRoot).should(
                'contain.text',
                newsletterFixtures.emailValidation
            );
            cy.get(newsletterRoot).should(
                'not.contain.text',
                newsletterFixtures.requiredValidation
            );
            // Check input validation and no email validation
            fillNewsletterForm();
            submitNewsLetterForm();
            cy.get(newsletterRoot).should(
                'contain.text',
                newsletterFixtures.requiredValidation
            );
            cy.get(newsletterRoot).should(
                'not.contain.text',
                newsletterFixtures.emailValidation
            );
        });
    }
);
