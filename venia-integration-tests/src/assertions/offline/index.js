export const assertOffline = () => {
    return cy
        .window()
        .its('navigator.onLine')
        .should('be.false');
};

export const assertOnline = () => {
    return cy
        .window()
        .its('navigator.onLine')
        .should('be.true');
};

export const assertServiceWorkerIsActivated = activeStatus => {
    const active =
        activeStatus === 'activating' || activeStatus === 'activated';
    expect(active).to.be.true;
};
