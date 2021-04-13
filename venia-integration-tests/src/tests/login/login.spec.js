import { username, password } from '../../fixtures/login';

import { login, openLoginDialog } from '../../actions/login';

import { accountMenuItemsField } from '../../fields/accountMenu';

describe('testing login trigger', () => {
    it('should login', () => {
        openLoginDialog();

        login(username, password);

        // asset that login was successful
        cy.get(accountMenuItemsField).should('be.visible');
    });
});
