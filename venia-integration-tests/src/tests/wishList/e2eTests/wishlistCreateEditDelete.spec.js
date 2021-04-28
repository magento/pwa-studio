import { firstName, lastName, accountEmail, accountPassword } from '../../../fixtures/accountAccess/index';

import { createAccount, openLoginDialog } from '../../../actions/accountAccess/index';

import { goToHomePage, visitPage } from '../../../actions/routes/index';

import { assertCreateAccount, goToMyAccount } from '../../../actions/myAccountMenu/index';

import { wishlistPage } from '../../../fixtures/myAccountMenu/index';

import { assertEmptyWishlist } from '../../../actions/wishlist/index';

import { categoryTops } from '../../../fixtures/categoryPage/index';

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        goToHomePage();
        openLoginDialog();
        createAccount(firstName, lastName, accountEmail, accountPassword);
        assertCreateAccount(firstName);
        goToMyAccount(firstName, wishlistPage);
        assertEmptyWishlist(wishlistPage);
        visitPage(categoryTops);
        // addProductToWishlist
        // goToWishListPage
        // assertProductInWishlist
        // goToProductsPage
        // addProductToWishlist
        // goToWishListPage
        // assertProductInWishlist
        // assertProductInWishlist
        // removeProduct
        // assertEmptyWishlist
    });
});
