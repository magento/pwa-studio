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
    productPage as productPageActions
} from '../../../actions';
import {
    myAccountMenu as myAccountMenuAssertions,
    wishlist as wishlistAssertions,
    categoryPage as categoryPageAssertions
} from '../../../assertions';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const { wishlistPage } = myAccountMenuFixtures;
const { categorySweaters, productCarinaCardigan } = categoryPageFixtures;
const { homePage } = homePageFixtures;
const { wishlistRoute } = wishlistFixtures;
const { productValeriaTwoLayeredTank } = productPageFixtures;

const { goToMyAccount } = myAccountMenuActions;
const { addProductToWishlistFromCategoryPage } = categoryPageActions;
const { addProductToWishlistFromProductPage } = productPageActions;

const { assertCreateAccount } = myAccountMenuAssertions;
const {
    assertWishlistHeading,
    assertEmptyWishlistExists,
    assertProductInWishlist
} = wishlistAssertions;
const { assertWishlistSelectedProductOnCategoryPage } = categoryPageAssertions;

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify single wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        cy.visitPage(homePage);

        cy.openLoginDialog();
        cy.createAccount(
            accountAccessFixtures.firstName,
            lastName,
            accountEmail,
            accountPassword
        );

        assertCreateAccount(firstName);

        goToMyAccount(firstName, wishlistPage);

        assertWishlistHeading(wishlistPage);
        assertEmptyWishlistExists('Wish List');

        cy.visitPage(categorySweaters);
        addProductToWishlistFromCategoryPage(productCarinaCardigan);
        assertWishlistSelectedProductOnCategoryPage(productCarinaCardigan);
        cy.visitPage(wishlistRoute);

        assertProductInWishlist(productCarinaCardigan);

        cy.visitPage(productValeriaTwoLayeredTank.url);
        //This will be updated once https://jira.corp.magento.com/browse/PWA-1709 is code complete
        addProductToWishlistFromProductPage();
        cy.visitPage(wishlistRoute);

        assertProductInWishlist(productCarinaCardigan);
        //This will be updated once https://jira.corp.magento.com/browse/PWA-1709 is code complete
        // assertProductInWishlist(productValeriaTwoLayeredTank.url);

        //This test also need to account for Remove the added product and assert for empty wishlist part of PWA-1683
    });
});
