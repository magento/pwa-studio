import {
    accountAccess,
    myAccountMenu,
    categoryPage,
    homePage as homePageFixtures,
    wishlist,
    productPage
} from '../../../fixtures';

import { visitPage } from '../../../actions/routes';

import {
    assertCreateAccount,
    goToMyAccount
} from '../../../actions/myAccountMenu';

import {
    assertWishlistHeading,
    assertEmptyWishlist,
    assertProductInWishlist,
    removeProductFromWishlist
} from '../../../actions/wishlist';

import { addProductToWishlistFromCategoryPage } from '../../../actions/categoryPage';

import { addProductToWishlistFromProductPage } from '../../../actions/productPage';

const { firstName, lastName, accountEmail, accountPassword } = accountAccess;
const { wishlistPage } = myAccountMenu;
const { categorySweaters, productCarinaCardigan } = categoryPage;
const { homePage } = homePageFixtures;
const { wishistRoute } = wishlist;
const { productValeriaTwoLayeredTankUrl } = productPage;

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify single wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        visitPage(homePage);

        cy.openLoginDialog();
        cy.createAccount(firstName, lastName, accountEmail, accountPassword);

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
