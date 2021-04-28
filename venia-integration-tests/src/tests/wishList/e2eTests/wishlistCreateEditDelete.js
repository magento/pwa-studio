import { firstName, lastName, accountEmail, accountPassword } from '../../../fixtures/accountAccess/index';

import { createAccount, openLoginDialog } from '../../../actions/accountAccess/index';

import { goToHomePage } from '../../../actions/routes/index';

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        goToHomePage();
        openLoginDialog();
        createAccount(firstName, lastName, accountEmail, accountPassword);
        assertCreateAccount
        goToWishListPage
        assertEmptyWishlist
        goToCategoryPage
        addProductToWishlist
        goToWishListPage
        assertProductInWishlist
        goToProductsPage
        addProductToWishlist
        goToWishListPage
        assertProductInWishlist
        assertProductInWishlist
        removeProduct
        assertEmptyWishlist
    });
});
