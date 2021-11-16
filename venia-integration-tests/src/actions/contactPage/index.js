import {
    contactFormName,
    contactFormEmail,
    contactFormTelephone,
    contactFormComment,
    contactFormSubmitButton
} from '../../fields/contactPage';

export const fillContactForm = ({ name, email, telephone, comment }) => {
    cy.get(contactFormName)
        .clear()
        .type(name ? name : '');

    cy.get(contactFormEmail)
        .clear()
        .type(email ? email : '');

    cy.get(contactFormTelephone)
        .clear()
        .type(telephone ? telephone : '');

    cy.get(contactFormComment)
        .clear()
        .type(comment ? comment : '');
};

export const submitContactForm = () => {
    cy.get(contactFormSubmitButton).click();
};
