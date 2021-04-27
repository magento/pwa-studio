import {firstName, lastName, accountEmail, accountPassword} from '../../fixtures/accountAccess';

import { createAccount, openLoginDialog } from '../../actions/accountAccess';

import { goToHomePage } from '../../actions/routes';

describe('testing account menu items', () => {
    it('should render order history link', () => {
        goToHomePage();
        openLoginDialog();
        createAccount(firstName, lastName, accountEmail, accountPassword);
    });
});
