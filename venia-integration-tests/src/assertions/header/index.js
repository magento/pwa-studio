import { headerCartTriggerCount } from '../../fields/header';

/**
 * Utility function to assert Cart Trigger Product count
 *
 * @param {Number} count Cart count
 */
export const assertCartTriggerCount = count => {
    cy.get(headerCartTriggerCount).should('contain', count);
};
