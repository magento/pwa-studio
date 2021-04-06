import { username, password } from '../../fixtures/login';

import { login, openLoginDialog } from '../../actions/login';

import { orderHistoryLink } from '../../fields/accountMenu';

describe('testing account menu items', () => {
    it('should render order history link', () => {
        openLoginDialog();

        login(username, password);

        // asset that order history link is visible
        cy.get(orderHistoryLink).should('be.visible');
    });
});
