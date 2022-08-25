import {
    accountAccess as accountAccessFixtures,
    homePage as homePageFixtures,
    wishlist as wishlistFixtures,
    categoryPage as categoryPageFixtures,
    productPage as productPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import {
    myAccountMenu as myAccountMenuAssertions,
    wishlist as wishlistAssertions,
    categoryPage as categoryPageAssertions,
    productPage as productPageAssertions
} from '../../../assertions';
import {
    wishlistPage as wishlistPageActions,
    categoryPage as categoryPageActions,
    productPage as productPageActions
} from '../../../actions';
import { aliasMutation } from '../../../utils/graphql-test-utils';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const { homePage } = homePageFixtures;
const { assertCreateAccount } = myAccountMenuAssertions;
const { wishlistRoute } = wishlistFixtures;
const { createWishlist, expandCollapsedWishlists } = wishlistPageActions;
const {
    assertEmptyWishlistExists,
    assertCreateWishlistLink,
    assertCreateWishlistLinkNotVisible,
    assertProductInWishlist
} = wishlistAssertions;
const { categoryTops, productCarinaCardigan } = categoryPageFixtures;
const {
    addProductToWishlistFromCategoryPage,
    createWishlistViaDialog
} = categoryPageActions;
const { assertWishlistSelectedProductOnCategoryPage } = categoryPageAssertions;
const { productAugustaEarrings } = productPageFixtures;
const {
    addProductToWishlistFromProductPage,
    addProductToExistingWishlistFromDialog
} = productPageActions;
const { assertProductSelectIndicator } = productPageAssertions;
const {
    getCustomerWishlistCall,
    getMultipleWishlistConfigCall,
    getStoreConfigDataForGalleryACCall,
    getWishlistDialogDataCall,
    getWishlistitemsForLocalFieldsCall,
    hitGraphqlPath,
    getWishlistConfigForGalleryCall,
    getWishlistConfigForProductPageCall,
    getWishlistConfigForWishlistPageCall,
    getNewCustomerWishlistCall
} = graphqlMockedCallsFixtures;

describe(
    'PWA-1782: verify multiple wishlist basic features',
    { tags: ['@integration', '@commerce', '@ci', '@wishlist'] },
    () => {
        it('user should be able to add and remove products from wishlist', () => {
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'CreateAccount');
                aliasMutation(req, 'SignInAfterCreate');
            });

            //Create an user account
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

            // This assert is not related to this test but just to make sure cypress waits for account creation before it jumps to next line
            assertCreateAccount(firstName);

            //Go to wishlist page and assert empty wishlist page
            cy.intercept('GET', getCustomerWishlistCall, {
                fixture: 'wishlist/multipleWishlist/defaultWishlistPage.json'
            }).as('getCustomerWishlist');
            cy.intercept('GET', getMultipleWishlistConfigCall, {
                fixture:
                    'wishlist/multipleWishlist/multipleWishlistEnabled.json'
            }).as('getWishlistConfig');
            cy.intercept('GET', getWishlistConfigForWishlistPageCall, {
                fixture: 'wishlist/multipleWishlist/wishlistPageConfig.json'
            }).as('getWishlistPageConfig');
            cy.visitPage(wishlistRoute);
            cy.wait(['@getCustomerWishlist']).its('response.body');
            cy.wait(['@getWishlistConfig']).its('response.body');

            assertEmptyWishlistExists('Wish List');
            assertCreateWishlistLink();

            //create an empty wishlist and assert its empty
            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('createWishlist')) {
                    req.reply({
                        fixture:
                            'wishlist/multipleWishlist/wishlistPageCreateWishlist1.json'
                    });
                }
            }).as('createWishlist1');
            cy.intercept('GET', getCustomerWishlistCall, {
                fixture:
                    'wishlist/multipleWishlist/oneWishlistNoProductsPage.json'
            }).as('getCustomerWishlist1');
            createWishlist('Test List1');
            cy.wait(['@getCustomerWishlist1']).its('response.body');
            cy.wait('@createWishlist1').should(result => {
                expect(result.request.body.variables).to.eql({
                    input: { name: 'Test List1', visibility: 'PRIVATE' }
                });
                expect(result.response.body).to.exist;
            });

            assertEmptyWishlistExists('Wish List');
            assertEmptyWishlistExists('Test List1');
            assertCreateWishlistLink();

            // Go to Category Page
            cy.intercept('GET', getWishlistitemsForLocalFieldsCall, {
                fixture:
                    'wishlist/multipleWishlist/categoryPageGetWishListDataForLocalFields.json'
            }).as('getWishlistLocalFields');
            cy.intercept('GET', getWishlistConfigForGalleryCall, {
                fixture:
                    'wishlist/multipleWishlist/categoryPageGetWishlistConfigForGallery.json'
            }).as('getGalleryWishlist');
            cy.intercept('GET', getStoreConfigDataForGalleryACCall, {
                fixture:
                    'wishlist/multipleWishlist/categoryPageGalleryWishlistConfig.json'
            }).as('getGalleryWishlistConfig');
            cy.intercept('GET', getWishlistDialogDataCall, {
                fixture:
                    'wishlist/multipleWishlist/categoryPageGetWishlistDialogData.json'
            }).as('getCustomerWishlist2');
            cy.visitPage(categoryTops.url);
            cy.wait(['@getWishlistLocalFields']).its('response.body');
            cy.wait(['@getCustomerWishlist2']).its('response.body');

            // add product to wishlist
            addProductToWishlistFromCategoryPage(productCarinaCardigan);

            // create new list via dialog
            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('createWishlist')) {
                    req.reply({
                        fixture:
                            'wishlist/multipleWishlist/categoryPageCreateWishlist2.json'
                    });
                }
            }).as('createWishlist2');
            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('addProductToWishlist')) {
                    req.reply({
                        fixture:
                            'wishlist/multipleWishlist/categoryPageAddProductToWishlist.json'
                    });
                }
            }).as('addProductToWishlist');
            cy.intercept('GET', getWishlistDialogDataCall, {
                fixture:
                    'wishlist/multipleWishlist/categoryPageGetWishlistDialogDataUpdated.json'
            }).as('getCustomerWishlist3');
            cy.intercept('GET', getWishlistitemsForLocalFieldsCall, {
                fixture:
                    'wishlist/multipleWishlist/categoryPageGetWishListDataForLocalFieldsUpdated.json'
            }).as('getWishlistLocalFields1');
            createWishlistViaDialog('Test List2');
            cy.wait(['@createWishlist2']).should(result => {
                expect(result.request.body.variables).to.eql({
                    name: 'Test List2',
                    visibility: 'PRIVATE'
                });
                expect(result.response.body).to.exist;
            });
            cy.wait(['@addProductToWishlist']).its('response.body');
            cy.wait(['@getCustomerWishlist3']).its('response.body');
            cy.wait(['@getWishlistLocalFields1']).its('response.body');

            // assert product exists in wishlist on category page
            assertWishlistSelectedProductOnCategoryPage(productCarinaCardigan);

            cy.intercept('GET', getCustomerWishlistCall, {
                fixture:
                    'wishlist/multipleWishlist/twoWishlistOneProductPage.json'
            }).as('getCustomerWishlist4');
            cy.intercept('GET', getMultipleWishlistConfigCall, {
                fixture:
                    'wishlist/multipleWishlist/multipleWishlistEnabled.json'
            }).as('getWishlistConfig2');
            cy.visitPage(wishlistRoute);
            cy.wait(['@getCustomerWishlist4']).its('response.body');
            cy.wait(['@getWishlistConfig2']).its('response.body');

            cy.intercept('GET', getNewCustomerWishlistCall, {
                fixture:
                    'wishlist/multipleWishlist/wishlistExpandWishlistPage.json'
            }).as('getCustomerWishlist5');
            expandCollapsedWishlists();
            cy.wait(['@getCustomerWishlist5']).its('response.body');

            // assert product exists in wishlist on wishlist page
            assertCreateWishlistLink();
            assertProductInWishlist(productCarinaCardigan);

            // got to product details page
            cy.intercept('GET', getWishlistConfigForProductPageCall, {
                fixture:
                    'wishlist/multipleWishlist/productPageWishlistConfig.json'
            }).as('getGeneralWishlistConfig');
            cy.intercept('GET', getWishlistDialogDataCall, {
                fixture:
                    'wishlist/multipleWishlist/productPageGetWishlistDialogData.json'
            }).as('getProductPageWishlistDialogData');

            cy.visitPage(productAugustaEarrings.url);

            cy.wait(['@getGeneralWishlistConfig']).its('response.body');
            cy.wait(['@getProductPageWishlistDialogData']).its('response.body');

            // add product to wishlist
            addProductToWishlistFromProductPage();
            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('addProductToWishlist')) {
                    req.reply({
                        fixture:
                            'wishlist/multipleWishlist/ProductPageAddProductToWishlist.json'
                    });
                }
            }).as('addProductToWishlist2');
            cy.intercept('GET', getWishlistDialogDataCall, {
                fixture:
                    'wishlist/multipleWishlist/productPageGetWishlistDialogData.json'
            }).as('getProductPageWishlistDialogData2');
            addProductToExistingWishlistFromDialog('Test List1');
            cy.wait(['@addProductToWishlist2']).its('response.body');
            cy.wait(['@getProductPageWishlistDialogData2']).its(
                'response.body'
            );

            //assert product in wishlist on PDP page
            assertProductSelectIndicator();

            cy.intercept('GET', getCustomerWishlistCall, {
                fixture:
                    'wishlist/multipleWishlist/twoWishlistTwoProductPage.json'
            }).as('getCustomerWishlist6');
            cy.intercept('GET', getMultipleWishlistConfigCall, {
                fixture:
                    'wishlist/multipleWishlist/multipleWishlistEnabled.json'
            }).as('getWishlistConfig3');
            cy.visitPage(wishlistRoute);
            cy.wait(['@getCustomerWishlist6']).its('response.body');
            cy.wait(['@getWishlistConfig3']).its('response.body');
            cy.wait(1000);
            cy.intercept('GET', getNewCustomerWishlistCall, {
                fixture:
                    'wishlist/multipleWishlist/wishlistExpandWishlistPageEarrings.json'
            }).as('getCustomerWishlist7');
            expandCollapsedWishlists();
            cy.wait(['@getCustomerWishlist7']).its('response.body');
            assertCreateWishlistLink();
            assertProductInWishlist(productAugustaEarrings.name);

            // Create two empty wishlists and assert its empty
            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('createWishlist')) {
                    req.reply({
                        fixture:
                            'wishlist/multipleWishlist/wishlistPageCreateWishlist4.json'
                    });
                }
            }).as('createWishlist4');
            cy.intercept('POST', hitGraphqlPath, req => {
                if (req.body.operationName.includes('createWishlist')) {
                    req.reply({
                        fixture:
                            'wishlist/multipleWishlist/wishlistPageCreateWishlist5.json'
                    });
                }
            }).as('createWishlist5');

            createWishlist('Test List4');
            createWishlist('Test List5');

            cy.intercept('GET', getCustomerWishlistCall, {
                fixture:
                    'wishlist/multipleWishlist/fiveWishlistOneProductPage.json'
            }).as('getCustomerWishlist8');
            cy.wait(['@getCustomerWishlist8']).its('response.body');

            assertEmptyWishlistExists('Test List4');
            assertEmptyWishlistExists('Test List5');

            // Verify that wishlist button is removed when maximum number of wishlists reached
            assertCreateWishlistLinkNotVisible();

            // NOTE - This will be done part of cypress streamline ticket.
            // assert other product exists in wishlist
            // assertProductInWishlist(productCarinaCardigan);
        });
    }
);
