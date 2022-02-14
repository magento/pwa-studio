const goOffline = () => {
  cy.log('**go offline**')
  .then(() => {
    Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.enable',
      })
  })
  .then(() => {
    Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.emulateNetworkConditions',
        params: {
          offline: true,
          latency: -1,
          downloadThroughput: -1,
          uploadThroughput: -1,
					connectionType: 'none',
        },
      })
  })
}

const goOnline = () => {
  cy.log('**go online**')
  .then(() => {
    Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.emulateNetworkConditions',
        params: {
          offline: false,
          latency: -1,
          downloadThroughput: -1,
          uploadThroughput: -1,
        },
      })
  })
  .then(() => {
    Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.disable',
      })
  })
}

Cypress.Commands.add('goOffline', goOffline);
Cypress.Commands.add('goOnline', goOnline);