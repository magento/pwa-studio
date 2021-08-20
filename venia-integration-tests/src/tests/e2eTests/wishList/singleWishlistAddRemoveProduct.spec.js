import {
    accountAccess as accountAccessFixtures,
    categoryPage as categoryPageFixtures,
    cartPage as cartPageFixtures,
    homePage as homePageFixtures,
    myAccountMenu as myAccountMenuFixtures,
    wishlist as wishlistFixtures,
    productPage as productPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import {
    cartPage as cartPageActions,
    categoryPage as categoryPageActions,
    myAccountMenu as myAccountMenuActions,
    productPage as productPageActions,
    wishlistPage as wishlistPageActions
} from '../../../actions';
import {
    myAccountMenu as myAccountMenuAssertions,
    wishlist as wishlistAssertions,
    categoryPage as categoryPageAssertions
} from '../../../assertions';
import { aliasMutation } from '../../../utils/graphql-test-utils';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const { wishlistPage } = myAccountMenuFixtures;
const { categorySweaters, productCarinaCardigan } = categoryPageFixtures;
const { cartPageRoute } = cartPageFixtures;
const { homePage } = homePageFixtures;
const { wishlistRoute } = wishlistFixtures;
const {
    productValeriaTwoLayeredTank,
    silverAmorBangleSet
} = productPageFixtures;
const { hitGraphqlPath } = graphqlMockedCallsFixtures;

const { moveProductFromCartToSingleWishlist } = cartPageActions;
const { goToMyAccount } = myAccountMenuActions;
const { addProductToWishlistFromCategoryPage } = categoryPageActions;
const {
    addProductToWishlistFromProductPage,
    addSimpleProductToCartFromProductPage
} = productPageActions;
const { removeProductFromSingleWishlist } = wishlistPageActions;

const { assertCreateAccount } = myAccountMenuAssertions;
const {
    assertWishlistHeading,
    assertEmptyWishlistExists,
    assertProductInWishlist,
    asserProductNotInWishlist
} = wishlistAssertions;
const { assertWishlistSelectedProductOnCategoryPage } = categoryPageAssertions;

// TODO add tags CE, EE to test to filter and run tests as needed
describe('verify single wishlist basic features', () => {
    it('user should be able to add and remove products from wishlist', () => {
        cy.intercept('POST', hitGraphqlPath, req => {
            aliasMutation(req, 'CreateAccount');
            aliasMutation(req, 'SignInAfterCreate');
            aliasMutation(req, 'AddProductToWishlistFromGallery');
            aliasMutation(req, 'AddProductToCart');
            aliasMutation(req, 'RemoveProductsFromWishlist');
        });

        cy.visitPage(homePage);

        cy.openLoginDialog();
        cy.createAccount(
            accountAccessFixtures.firstName,
            lastName,
            accountEmail,
            accountPassword
        );

        cy.wait(
            ['@gqlCreateAccountMutation', '@gqlSignInAfterCreateMutation'],
            {
                timeout: 60000
            }
        );

        assertCreateAccount(firstName);

        goToMyAccount(firstName, wishlistPage);

        assertWishlistHeading(wishlistPage);
        assertEmptyWishlistExists('Wish List');

        cy.visitPage(categorySweaters);
        addProductToWishlistFromCategoryPage(productCarinaCardigan);

        cy.wait(['@gqlAddProductToWishlistFromGalleryMutation'], {
            timeout: 60000
        });

        assertWishlistSelectedProductOnCategoryPage(productCarinaCardigan);

        cy.visitPage(wishlistRoute);

        assertProductInWishlist(productCarinaCardigan);

        cy.visitPage(productValeriaTwoLayeredTank.url);
        addProductToWishlistFromProductPage();

        cy.wait(['@gqlAddProductToWishlistFromGalleryMutation'], {
            timeout: 60000
        });

        cy.visitPage(wishlistRoute);

        assertProductInWishlist(productCarinaCardigan);
        assertProductInWishlist(productValeriaTwoLayeredTank.name);

        cy.visitPage(silverAmorBangleSet.url);
        addSimpleProductToCartFromProductPage();

        cy.wait(['@gqlAddProductToCartMutation'], {
            timeout: 60000
        });

        cy.visitPage(cartPageRoute);
        moveProductFromCartToSingleWishlist(silverAmorBangleSet.name);

        cy.wait(['@gqlAddProductToWishlistFromGalleryMutation'], {
            timeout: 60000
        });

        cy.visitPage(wishlistRoute);

        assertProductInWishlist(productCarinaCardigan);
        assertProductInWishlist(productValeriaTwoLayeredTank.name);
        assertProductInWishlist(silverAmorBangleSet.name);

        removeProductFromSingleWishlist(productCarinaCardigan);

        cy.wait(['@gqlRemoveProductsFromWishlistMutation'], {
            timeout: 60000
        });

        asserProductNotInWishlist(productCarinaCardigan);
    });
});
