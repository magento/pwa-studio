/// <reference types="cypress" />

import { filterButton } from '../../fields/categoryPage';

describe('Assert category page filter modal', () => {
    it('should render the modal correctly', () => {
        cy.viewport(1440, 900);

        cy.wait(500);

        cy.visit('/venia-tops.html?page=1');

        cy.wait(3000);

        cy.get(filterButton).click();

        cy.wait(200);

        cy.matchImageSnapshot('Filter-Modal', {
            failureThreshold: 0,
            capture: 'viewport'
        });
    });
});
