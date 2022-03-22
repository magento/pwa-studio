/**
 * Utility function to simulate an offline network status
 * @link https://www.cypress.io/blog/2020/11/12/testing-application-in-offline-network-mode/
 */
const goOffline = () => {
    cy.log('**go offline**')
        .then(() => {
            Cypress.automation('remote:debugger:protocol', {
                command: 'Network.enable'
            });
        })
        .then(() => {
            Cypress.automation('remote:debugger:protocol', {
                command: 'Network.emulateNetworkConditions',
                params: {
                    offline: true,
                    latency: -1,
                    downloadThroughput: -1,
                    uploadThroughput: -1,
                    connectionType: 'none'
                }
            });
        });
};

Cypress.Commands.add('goOffline', goOffline);
