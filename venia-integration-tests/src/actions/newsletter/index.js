import {
    newsletterEmailInput,
    newsletterSubmitButton
} from '../../fields/newsletter';

export const fillNewsletterForm = email => {
    if (email) {
        cy.get(newsletterEmailInput)
            .clear()
            .type(email);
    } else {
        cy.get(newsletterEmailInput).clear();
    }
};

export const submitNewsLetterForm = () => {
    cy.get(newsletterSubmitButton).click();
};
