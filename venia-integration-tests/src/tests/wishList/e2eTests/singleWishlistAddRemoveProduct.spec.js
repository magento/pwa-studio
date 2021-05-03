import { firstName, lastName, accountEmail, accountPassword } from '../../../fixtures/accountAccess/index';

import { createAccount, openLoginDialog } from '../../../actions/accountAccess/index';

import { visitPage } from '../../../actions/routes/index';

import { assertCreateAccount, goToMyAccount } from '../../../actions/myAccountMenu/index';

import { wishlistPage } from '../../../fixtures/myAccountMenu/index';

import { assertWishlistHeading, assertEmptyWishlist, assertProductInWishlist, removeProductFromWishlist } from '../../../actions/wishlist/index';

import { categorySweaters, productCarinaCardigan } from '../../../fixtures/categoryPage/index';

import { homePage } from '../../../fixtures/homePage/index';

import { addProductToWishlistFromCategoryPage } from '../../../actions/categoryPage/index';

import { wishistRoute } from '../../../fixtures/wishlist/index';

import { } from '../../../actions/wishlist/index';

import { productValeriaTwoLayeredTankUrl } from '../../../fixtures/productPage/index';

import { addProductToWishlistFromProductPage } from '../../../actions/productPage/index';


// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify single wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        visitPage(homePage);
        openLoginDialog();
        createAccount(firstName, lastName, accountEmail, accountPassword);
        assertCreateAccount(firstName);
        goToMyAccount(firstName, wishlistPage);
        assertWishlistHeading(wishlistPage);
        assertEmptyWishlist();
        visitPage(categorySweaters);
        addProductToWishlistFromCategoryPage(productCarinaCardigan);
        visitPage(wishistRoute);
        assertProductInWishlist(productCarinaCardigan);
        visitPage(productValeriaTwoLayeredTankUrl);
        //This will be updated once https://jira.corp.magento.com/browse/PWA-1267 is code complete
        addProductToWishlistFromProductPage();
        visitPage(wishistRoute);
        assertProductInWishlist(productCarinaCardigan);
        //This will be updated once https://jira.corp.magento.com/browse/PWA-1267 is code complete
        // assertProductInWishlist(productValeriaTwoLayeredTankUrl);
        removeProductFromWishlist(productCarinaCardigan);
        //This will be updated once https://jira.corp.magento.com/browse/PWA-1267 is code complete
        // removeProductFromWishlist(productValeriaTwoLayeredTankUrl);
        assertEmptyWishlist(wishlistPage);
    });
});
