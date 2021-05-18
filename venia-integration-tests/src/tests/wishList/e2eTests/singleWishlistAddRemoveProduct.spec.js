import {
    accountAccess as accountAccessFixtures,
    myAccountMenu as myAccountMenuFixtures,
    categoryPage as categoryPageFixtures,
    homePage as homePageFixtures,
    wishlist as wishlistFixtures,
    productPage as productPageFixtures
} from '../../../fixtures';
import {
    categoryPage as categoryPageActions,
    myAccountMenu as myAccountMenuActions,
    productPage as productPageActions,
    wishlist as wishlistActions
} from '../../../actions';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const { wishlistPage } = myAccountMenuFixtures;
const { categorySweaters, productCarinaCardigan } = categoryPageFixtures;
const { homePage } = homePageFixtures;
const { wishistRoute } = wishlistFixtures;
const { productValeriaTwoLayeredTankUrl } = productPageFixtures;

const { assertCreateAccount, goToMyAccount } = myAccountMenuActions;
const {
    assertWishlistHeading,
    assertEmptyWishlist,
    assertProductInWishlist,
    removeProductFromWishlist
} = wishlistActions;
const { addProductToWishlistFromCategoryPage } = categoryPageActions;
const { addProductToWishlistFromProductPage } = productPageActions;

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify single wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        cy.visitPage(homePage);

        cy.openLoginDialog();
        cy.createAccount(accountAccessFixtures.firstName, lastName, accountEmail, accountPassword);

        assertCreateAccount(firstName);

        goToMyAccount(firstName, wishlistPage);

        assertWishlistHeading(wishlistPage);
        assertEmptyWishlist();

        cy.visitPage(categorySweaters);
        addProductToWishlistFromCategoryPage(productCarinaCardigan);
        cy.visitPage(wishistRoute);

        assertProductInWishlist(productCarinaCardigan);

        cy.visitPage(productValeriaTwoLayeredTankUrl);
        //This will be updated once https://jira.corp.magento.com/browse/PWA-1267 is code complete
        addProductToWishlistFromProductPage();
        cy.visitPage(wishistRoute);

        assertProductInWishlist(productCarinaCardigan);
        //This will be updated once https://jira.corp.magento.com/browse/PWA-1267 is code complete
        // assertProductInWishlist(productValeriaTwoLayeredTankUrl);
        removeProductFromWishlist(productCarinaCardigan);
        //This will be updated once https://jira.corp.magento.com/browse/PWA-1267 is code complete
        // removeProductFromWishlist(productValeriaTwoLayeredTankUrl);

        //This will be updated once https://jira.corp.magento.com/browse/PWA-1707 is code complete
        // assertEmptyWishlist(wishlistPage);
    });
});
