const loadFullPage = (timeout = 1000) => {
    return cy.document().then(doc => {
        const docElm = doc.documentElement;
        const { scrollHeight, clientHeight } = docElm;
        const numOfScrolls = Math.ceil(scrollHeight / clientHeight);

        for (let i = 1; i <= numOfScrolls; i++) {
            cy.scrollTo('0px', `${clientHeight * i}px`);

            cy.wait(timeout);
        }
    });
};

Cypress.Commands.add('loadFullPage', loadFullPage);
