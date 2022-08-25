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
    productJunoSweater,
    productValeriaTwoLayeredTank,
    silverAmorBangleSet
} = productPageFixtures;
const { hitGraphqlPath } = graphqlMockedCallsFixtures;

const { moveProductFromCartToSingleWishlist } = cartPageActions;
const { goToMyAccount } = myAccountMenuActions;
const { addProductToWishlistFromCategoryPage } = categoryPageActions;
const {
    addProductToWishlistFromProductPage,
    addToCartFromProductPage,
    selectOptionsFromProductPage
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

describe(
    'PWA-1781: verify single wishlist basic features',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@wishlist'] },
    () => {
        it('user should be able to add and remove products from wishlist', () => {
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'CreateAccount');
                aliasMutation(req, 'SignInAfterCreate');
                aliasMutation(req, 'AddProductToWishlistFromGallery');
                aliasMutation(req, 'AddProductToCart');
                aliasMutation(req, 'RemoveProductsFromWishlist');
            });

            cy.visitPage(homePage);

            cy.toggleLoginDialog();
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

            // Add Configurable Product from Catalog Page
            cy.visitPage(categorySweaters);
            addProductToWishlistFromCategoryPage(productCarinaCardigan);

            cy.wait(['@gqlAddProductToWishlistFromGalleryMutation'], {
                timeout: 60000
            });

            assertWishlistSelectedProductOnCategoryPage(productCarinaCardigan);

            cy.visitPage(wishlistRoute);

            assertProductInWishlist(productCarinaCardigan);

            // Add Configurable Product from Product Detail Page without options selected
            cy.visitPage(productValeriaTwoLayeredTank.url);
            addProductToWishlistFromProductPage();

            cy.wait(['@gqlAddProductToWishlistFromGalleryMutation'], {
                timeout: 60000
            });

            // Add Configurable Product from Product Detail Page with options selected
            cy.visitPage(productJunoSweater.url);
            selectOptionsFromProductPage();
            addProductToWishlistFromProductPage();

            cy.wait(['@gqlAddProductToWishlistFromGalleryMutation'], {
                timeout: 60000
            });

            cy.visitPage(wishlistRoute);

            assertProductInWishlist(productCarinaCardigan);
            assertProductInWishlist(productValeriaTwoLayeredTank.name);
            assertProductInWishlist(productJunoSweater.name);

            // Add Simple Product to Cart
            cy.visitPage(silverAmorBangleSet.url);
            addToCartFromProductPage();

            cy.wait(['@gqlAddProductToCartMutation'], {
                timeout: 60000
            });

            // Move Simple Product from Cart
            cy.visitPage(cartPageRoute);
            moveProductFromCartToSingleWishlist(silverAmorBangleSet.name);

            cy.wait(['@gqlAddProductToWishlistFromGalleryMutation'], {
                timeout: 60000
            });

            cy.visitPage(wishlistRoute);

            assertProductInWishlist(productCarinaCardigan);
            assertProductInWishlist(productValeriaTwoLayeredTank.name);
            assertProductInWishlist(silverAmorBangleSet.name);

            // Remove Product
            removeProductFromSingleWishlist(productCarinaCardigan);

            cy.wait(['@gqlRemoveProductsFromWishlistMutation'], {
                timeout: 60000
            });

            asserProductNotInWishlist(productCarinaCardigan);
        });
    }
);
