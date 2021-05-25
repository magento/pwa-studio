const visitHomePage = (wait = 5000) => {
    cy.visitPage('/', wait);
};

const visitCartPage = (wait = 5000) => {
    cy.visitPage('/cart', wait);
};

const visitCheckoutPage = (wait = 5000) => {
    cy.visitPage('/checkout', wait);
};

const visitOrderHistoryPage = (wait = 5000) => {
    cy.visitPage('/order-history', wait);
};

const visitFavoritesPage = (wait = 5000) => {
    cy.visitPage('/wishlist', wait);
};

const visitAddressBookPage = (wait = 5000) => {
    cy.visitPage('/address-book', wait);
};

const visitSavedPaymentsPage = (wait = 5000) => {
    cy.visitPage('/saved-payments', wait);
};

const visitCommunicationsPage = (wait = 5000) => {
    cy.visitPage('/communications', wait);
};

const visitAccountInfoPage = (wait = 5000) => {
    cy.visitPage('/account-information', wait);
};

Cypress.Commands.add('visitHomePage', visitHomePage);
Cypress.Commands.add('visitCartPage', visitCartPage);
Cypress.Commands.add('visitCheckoutPage', visitCheckoutPage);
Cypress.Commands.add('visitOrderHistoryPage', visitOrderHistoryPage);
Cypress.Commands.add('visitFavoritesPage', visitFavoritesPage);
Cypress.Commands.add('visitAddressBookPage', visitAddressBookPage);
Cypress.Commands.add('visitSavedPaymentsPage', visitSavedPaymentsPage);
Cypress.Commands.add('visitCommunicationsPage', visitCommunicationsPage);
Cypress.Commands.add('visitAccountInfoPage', visitAccountInfoPage);
