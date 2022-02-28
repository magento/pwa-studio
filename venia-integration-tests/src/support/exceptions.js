Cypress.on('uncaught:exception', err => {
    // We expect which cache handle this call, so by default Apollo will return an error which crashes Cypress.
    if (err.message.includes('Failed to fetch')) {
        return false;
    }
});
