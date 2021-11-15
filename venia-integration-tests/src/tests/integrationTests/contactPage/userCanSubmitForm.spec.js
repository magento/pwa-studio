import {
    contactPage as contactPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';

import {
    fillContactForm,
    submitContactForm
} from '../../../actions/contactPage';

import {
    assertSuccessToast,
    assertInvalidEmailErrorMessage
} from '../../../assertions/contactPage';

const {
    getContactPageEnabledCall,
    hitGraphqlPath
} = graphqlMockedCallsFixtures;

const {
    contactPageRoute,
    contactFormName,
    contactFormEmail,
    contactFormTelephone,
    contactFormComment,
    contactFormInvalidEmail
} = contactPageFixtures;

describe('verify contact form', () => {
    it('user can fill and submit form', () => {
        cy.intercept('GET', getContactPageEnabledCall, {
            fixture: 'contactPage/contactPageConfigEnabled.json'
        }).as('gqlGetContactPageQuery');

        cy.intercept('POST', hitGraphqlPath, req => {
            if (req.body.operationName.includes('contactUs')) {
                req.reply({
                    fixture: 'contactPage/contactFormSubmitValid.json'
                });
            }
        }).as('submitContactForm');

        cy.visit(contactPageRoute);

        fillContactForm({
            name: contactFormName,
            email: contactFormEmail,
            telephone: contactFormTelephone,
            comment: contactFormComment
        });

        submitContactForm();
        cy.wait(['@submitContactForm']).its('response.body');

        assertSuccessToast();
    });

    it('user sees errors from response', () => {
        cy.intercept('GET', getContactPageEnabledCall, {
            fixture: 'contactPage/contactPageConfigEnabled.json'
        }).as('gqlGetContactPageQuery');

        cy.intercept('POST', hitGraphqlPath, req => {
            if (req.body.operationName.includes('contactUs')) {
                req.reply({
                    fixture: 'contactPage/contactFormSubmitInvalidEmail.json'
                });
            }
        }).as('submitContactForm');

        cy.visit(contactPageRoute);

        fillContactForm({
            name: contactFormName,
            email: contactFormInvalidEmail,
            telephone: contactFormTelephone,
            comment: contactFormComment
        });

        submitContactForm();
        cy.wait(['@submitContactForm']).its('response.body');

        assertInvalidEmailErrorMessage();
    });
});
