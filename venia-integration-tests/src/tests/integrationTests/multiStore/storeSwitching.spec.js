import {
    addProductToCartFromCategoryPage,
    selectCategoryFromMegaMenu
} from '../../../actions/categoryPage';
import {
    goToCartPageFromEditCartButton,
    triggerMiniCart
} from '../../../actions/miniCart';

import {
    selectStoreView,
    toggleHeaderStoreSwitcher
} from '../../../actions/storeSwitcher';
import { assertProductInCartPage } from '../../../assertions/cartPage';

import {
    assertNoProductsFound,
    assertNumberOfProductsListed,
    assertProductIsInGallery,
    assertProductsFound
} from '../../../assertions/categoryPage';

import {
    assertCategoryInCategoryTree,
    assertNumberOfCategoriesInCategoryTree
} from '../../../assertions/categoryTree';
import { assertCartTriggerCount } from '../../../assertions/header';

import {
    assertCategoryInMegaMenu,
    assertNumberOfCategoriesInMegaMenu
} from '../../../assertions/megaMenu';
import { assertProductInList } from '../../../assertions/miniCart';
import { assertErrorInPage } from '../../../assertions/notFoundPage';

import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
import {
    checkUserIsAuthedCall,
    getBreadcrumbsCall,
    getCartDetailsCall,
    getCategoryDataCall,
    getCMSPage,
    getCurrencyDataCall,
    getFilterInputsForCategoryCall,
    getItemCountCall,
    getPageSizeCall,
    getPriceSummaryCall,
    getProductFiltersByCategoryCall,
    getProductsByUrlKeyCall,
    getRouteDataCall,
    getStoreConfigDataForGalleryACCall,
    getStoreConfigForBreadcrumbsCall,
    getStoreConfigForCarouselACCall,
    getStoreConfigForCartPageCall,
    hitGraphqlPath,
    miniCartQueryCall,
    resolveUrlCall
} from '../../../fixtures/graphqlMockedCalls';
import {
    accessoriesPathname,
    defaultAccessoriesProducts,
    defaultStore,
    secondStore,
    subcategoryAPathname,
    subcategoryAProducts,
    subcategoryBPathname
} from '../../../fixtures/multiStore';

const {
    getStoreConfigDataCall,
    getStoreNameCall,
    getAvailableStoresDataCall,
    getStoreConfigForMegaMenuCall,
    getMegaMenuCall,
    getStoreConfigForContactUsCall,
    getStoreConfigForNewsletterCall,
    storeConfigDataCall,
    getNavigationMenuCall,
    getLocaleCall,
    getRootCategoryIdCall,
    getStoreConfigForMiniCartCall,
    getStoreConfigForCategoryTreeCall,
    getCategoriesCall,
    getAppliedCouponsCall,
    getAppliedGiftCardsCall,
    getProductListingCall,
    getShippingMethodsCall
} = graphqlMockedCallsFixtures;

const DATA_DIRECTORY = 'multiStore/data';

/**
 * Returns the proper fixture directory for a specific
 * store code
 *
 * @param {String} storeCode
 * @returns {String} fixture directory for a store view
 */
const getFixtureLocationPrefix = storeCode => {
    switch (storeCode) {
        case defaultStore.viewOne.storeCode:
            return `${DATA_DIRECTORY}/default/view-1`;
        case secondStore.viewOne.storeCode:
            return `${DATA_DIRECTORY}/storeB/view-1`;
        default:
            return `${DATA_DIRECTORY}/default`;
    }
};

/**
 * Helper function for generating an intercept handler
 *
 * @param {String} filename name of the fixture file
 * @param {String} expectedStoreCode store code the request should be sending in the header
 * @returns {Function} an intercept handler that checks the store code header and returns
 *  data from a fixture file
 */
const getInterceptHandler = (filename, expectedStoreCode) => {
    const handler = req => {
        const storeCode = req.headers.store;
        expect(storeCode).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${getFixtureLocationPrefix(storeCode)}/${filename}.json`
        });
    };

    return handler;
};

/**
 * Helper function for generating an intercept handler that returns
 * the correct cart state fixture
 *
 * @param {number} items the number of items in the cart
 * @param {String} expectedStoreCode store code the request should be sending in the header
 * @returns {Fixture} an intercept handler
 */
const getCartFixtureData = (items, expectedStoreCode) => {
    return req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        switch (items) {
            case 1:
                req.reply({
                    fixture: `${DATA_DIRECTORY}/cart/cart-1.json`
                });
                break;
            case 2:
                req.reply({
                    fixture: `${DATA_DIRECTORY}/cart/cart-2.json`
                });
                break;
            case 3:
                req.reply({
                    fixture: `${DATA_DIRECTORY}/cart/cart-3.json`
                });
                break;
        }
    };
};

/**
 * Setup network intercepts that return mocked cart data
 *
 * @param {number} numItems Number of items the cart has in the backend
 * @param {String} targetStoreCode Storecode the request should be sending in the header
 */
const interceptCartDataRequests = (numItems, targetStoreCode) => {
    cy.intercept(
        'GET',
        getItemCountCall,
        getCartFixtureData(numItems, targetStoreCode)
    ).as('getMockItemCount');

    cy.intercept(
        'GET',
        checkUserIsAuthedCall,
        getCartFixtureData(numItems, targetStoreCode)
    ).as('getMockAuthedUserCheck');

    cy.intercept(
        'GET',
        miniCartQueryCall,
        getCartFixtureData(numItems, targetStoreCode)
    ).as('getMockMiniCart');
};

/**
 * Setup network intercepts that return mocked data for requests
 * specific to the accessories category page
 *
 * @param {String} expectedStoreCode
 */
const interceptAccessoriesPageRequests = expectedStoreCode => {
    cy.intercept(
        getCategoriesCall,
        getInterceptHandler('accessoriesCategory', expectedStoreCode)
    ).as('getMockAccessoriesCategory');
    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('accessoriesCategory', expectedStoreCode)
    ).as('getMockAccessoryBreadcrumbs');
    cy.intercept(
        'GET',
        getCategoryDataCall,
        getInterceptHandler('accessoriesCategory', expectedStoreCode)
    ).as('getMockCategoryData');

    cy.intercept('GET', getProductFiltersByCategoryCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/default/accessoriesProductFilters.json`
        });
    }).as('getMockProductFilter');
    cy.intercept('GET', getFilterInputsForCategoryCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/default/accessoriesFilterInputs.json`
        });
    }).as('getMockFilterInput');
};

/**
 * Setup network intercepts that return mocked data for requests
 * specific to the Category A category page
 *
 * @param {String} expectedStoreCode
 */
const interceptCategoryAPageRequests = expectedStoreCode => {
    cy.intercept(
        'GET',
        getCategoriesCall,
        getInterceptHandler('subcategoryA', expectedStoreCode)
    ).as('getMockSubcategoryACategory');

    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('subcategoryA', expectedStoreCode)
    ).as('getMockBreadcrumbsData');
    cy.intercept(
        'GET',
        getCategoryDataCall,
        getInterceptHandler('subcategoryA', expectedStoreCode)
    ).as('getMockCategoryData');

    cy.intercept('GET', getProductFiltersByCategoryCall, req => {
        expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/storeB/subcategoryAProductFilters.json`
        });
    }).as('getMockProductFilter');
    cy.intercept('GET', getFilterInputsForCategoryCall, req => {
        expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/storeB/subcategoryAFilterInputs.json`
        });
    }).as('getMockFilterInputs');
};

/**
 * Setup network intercepts that return mocked data for requests
 * specific to the Category B category page
 *
 * @param {String} expectedStoreCode
 */
const interceptCategoryBPageRequests = expectedStoreCode => {
    cy.intercept(
        'GET',
        getCategoriesCall,
        getInterceptHandler('subcategoryB', expectedStoreCode)
    ).as('getMockSubcategoryACategory');

    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('subcategoryB', expectedStoreCode)
    ).as('getMockBreadcrumbsData');
    cy.intercept(
        'GET',
        getCategoryDataCall,
        getInterceptHandler('subcategoryB', expectedStoreCode)
    ).as('getMockCategoryData');

    cy.intercept('GET', getProductFiltersByCategoryCall, req => {
        expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/storeB/subcategoryBProductFilters.json`
        });
    }).as('getMockProductFilter');
    cy.intercept('GET', getFilterInputsForCategoryCall, req => {
        expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/storeB/subcategoryBFilterInputs.json`
        });
    }).as('getMockFilterInputs');
};

/**
 * Setup network intercepts that return mocked data for requests
 * specific to the Cart page
 *
 * @param {String} expectedStoreCode
 */
const interceptCartPageRequests = expectedStoreCode => {
    cy.intercept('GET', getCartDetailsCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/details.json`
        });
    }).as('getMockCartDetails');

    cy.intercept('GET', getAppliedCouponsCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/details.json`
        });
    }).as('getMockAppliedCoupons');

    cy.intercept('GET', getAppliedGiftCardsCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/details.json`
        });
    }).as('getMockAppliedGiftCards');

    cy.intercept('GET', getShippingMethodsCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/details.json`
        });
    }).as('getMockShippingMethods');

    cy.intercept('GET', getPriceSummaryCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/priceSummary.json`
        });
    }).as('getMockPriceSummary');

    cy.intercept('GET', getProductListingCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/productListing.json`
        });
    }).as('getMockProductListing');
};

/**
 * Setup network intercepts that return mocked data for general
 * store view data requests
 *
 * @param {String} expectedStoreCode
 */
const interceptStoreRequests = expectedStoreCode => {
    // Requests for the available stores in the backend
    cy.intercept('GET', getAvailableStoresDataCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/availableStores.json`
        });
    }).as('getMockAvailableStores');

    // Requests for data about the homepage route
    cy.intercept('GET', getRouteDataCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/homeRoute.json`
        });
    }).as('getMockHomeRoute');

    // Requests for currency data
    cy.intercept('GET', getCurrencyDataCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/currency.json`
        });
    }).as('getMockCurrencyData');

    /**
     * Requests for cart data
     */
    cy.intercept('GET', getItemCountCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/empty.json`
        });
    }).as('getMockItemCount');

    cy.intercept('GET', checkUserIsAuthedCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/empty.json`
        });
    }).as('getMockAuthedUserCheck');

    cy.intercept('GET', miniCartQueryCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/empty.json`
        });
    }).as('getMockMiniCart');

    // Requests for CMS content
    cy.intercept('GET', getCMSPage, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cmsPage.json`
        });
    }).as('getMockCmsPage');

    // Request for the product carousel data
    cy.intercept('GET', getProductsByUrlKeyCall, req => {
        req.reply({
            fixture: `${DATA_DIRECTORY}/productsCarousel.json`
        });
    }).as('getMockProductCarousel');

    // Requests for MegaMenu data
    cy.intercept(
        'GET',
        getMegaMenuCall,
        getInterceptHandler('megaMenu', expectedStoreCode)
    ).as('getMockMegaMenu');

    // Requests for the side nav data
    cy.intercept(
        'GET',
        getNavigationMenuCall,
        getInterceptHandler('navigationMenu', expectedStoreCode)
    ).as('getMockNavigationMenu');

    // Requests for store configuration data
    const storeConfigRequests = [
        {
            alias: 'getMockStoreConfig',
            call: getStoreConfigDataCall
        },
        {
            alias: 'getMockStoreConfigForMegaMenu',
            call: getStoreConfigForMegaMenuCall
        },
        {
            alias: 'getMockStoreConfigForContactUs',
            call: getStoreConfigForContactUsCall
        },
        {
            alias: 'getMockStoreConfigForNewsletter',
            call: getStoreConfigForNewsletterCall
        },
        {
            alias: 'mockStoreConfig',
            call: storeConfigDataCall
        },
        {
            alias: 'getMockStoreConfigForCategoryTree',
            call: getStoreConfigForCategoryTreeCall
        },
        {
            alias: 'getMockLocale',
            call: getLocaleCall
        },
        {
            alias: 'getMockStoreConfigForMiniCart',
            call: getStoreConfigForMiniCartCall
        },
        {
            alias: 'getMockStoreName',
            call: getStoreNameCall
        },
        {
            alias: 'getMockStoreConfigForCarouselAC',
            call: getStoreConfigForCarouselACCall
        },
        {
            alias: 'getMockStoreConfigForBreadcrumbs',
            call: getStoreConfigForBreadcrumbsCall
        },
        {
            alias: 'getMockPageSize',
            call: getPageSizeCall
        },
        {
            alias: 'getMockStoreConfigDataForGalleryAC',
            call: getStoreConfigDataForGalleryACCall
        },
        {
            alias: 'getMockStoreConfigForCartPage',
            call: getStoreConfigForCartPageCall
        },
        {
            alias: 'getMockRootCategoryId',
            call: getRootCategoryIdCall
        }
    ];
    storeConfigRequests.forEach(request => {
        cy.intercept(
            'GET',
            request.call,
            getInterceptHandler('storeConfig', expectedStoreCode)
        ).as(request.alias);
    });
};

/**
 * Setup a network intercept that returns the correct route data fixture
 *
 * @param {String} expectedStoreCode
 */
const interceptRouteDataRequests = expectedStoreCode => {
    cy.intercept('GET', resolveUrlCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);

        const url = new URL(req.headers.referer);

        switch (url.pathname) {
            case '/':
            case `/${defaultStore.viewOne.storeCode}`:
            case `/${secondStore.viewOne.storeCode}`:
                req.alias = 'mockHomeRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/homeRoute.json`
                });
                break;
            case `/${defaultStore.viewOne}${accessoriesPathname}`:
            case `/${defaultStore.viewOne.storeCode}${accessoriesPathname}`:
            case accessoriesPathname:
                req.alias = 'mockAccessoriesRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/default/accessoriesRoute.json`
                });
                break;
            case `/${secondStore.viewOne.storeCode}${subcategoryAPathname}`:
            case subcategoryAPathname:
                req.alias = 'mockSubcategoryARouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/storeB/subcategoryARoute.json`
                });
                break;
            case `/${secondStore.viewOne.storeCode}${subcategoryBPathname}`:
            case subcategoryBPathname:
                req.alias = 'mockSubcategoryBRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/storeB/subcategoryBRoute.json`
                });
                break;
        }
    });
};

describe('default store', () => {
    it('displays subcategories from the default root category', () => {
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@getMockMegaMenu',
            '@getMockNavigationMenu',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForCategoryTree'
        ]);

        // Assertions to make sure we are using the mock data for categories
        assertNumberOfCategoriesInMegaMenu(defaultStore.categories.length);
        assertNumberOfCategoriesInCategoryTree(defaultStore.categories.length);

        defaultStore.categories.forEach(categoryLabel => {
            assertCategoryInMegaMenu(categoryLabel);
            assertCategoryInCategoryTree(categoryLabel);
        });
    });

    it('displays assigned products', () => {
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@getMockMegaMenu',
            '@getMockNavigationMenu',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForCategoryTree'
        ]);

        // Setup calls for the accessories page
        interceptAccessoriesPageRequests(defaultStore.defaultView.storeCode);

        // Navigate to the accessories category
        selectCategoryFromMegaMenu(defaultStore.categories[3]);

        cy.wait('@getMockAccessoriesCategory');

        assertProductsFound();

        // Assertions to make sure we are using the mock data for accessories
        assertNumberOfProductsListed(defaultAccessoriesProducts.length);

        defaultAccessoriesProducts.forEach(productName => {
            assertProductIsInGallery(productName);
        });
    });
});

describe('switching to another store', () => {
    it('shows categories specific to the different store', () => {
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@getMockMegaMenu',
            '@getMockNavigationMenu',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForCategoryTree'
        ]);

        // Setup network interactions for the second store view
        interceptStoreRequests(secondStore.viewOne.storeCode);
        interceptRouteDataRequests(secondStore.viewOne.storeCode);

        // Switch to second store view
        toggleHeaderStoreSwitcher();
        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        // Assert categories for second store
        assertNumberOfCategoriesInMegaMenu(secondStore.categories.length);
        assertNumberOfCategoriesInCategoryTree(secondStore.categories.length);

        secondStore.categories.forEach(categoryLabel => {
            assertCategoryInMegaMenu(categoryLabel);
            assertCategoryInCategoryTree(categoryLabel);
        });

        // Setup network interactions for a different store one view
        interceptStoreRequests(defaultStore.viewOne.storeCode);
        interceptRouteDataRequests(defaultStore.viewOne.storeCode);

        // Switch to different store one view
        toggleHeaderStoreSwitcher();
        selectStoreView(
            `${defaultStore.groupName} - ${defaultStore.viewOne.storeName}`
        );

        // Assertions to make sure we are showing the default mock data
        assertNumberOfCategoriesInMegaMenu(defaultStore.categories.length);
        assertNumberOfCategoriesInCategoryTree(defaultStore.categories.length);

        defaultStore.categories.forEach(categoryLabel => {
            assertCategoryInMegaMenu(categoryLabel);
            assertCategoryInCategoryTree(categoryLabel);
        });
    });

    it('shows products specific to the categories in the different store', () => {
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@mockHomeRouteData',
            '@getMockMegaMenu',
            '@getMockNavigationMenu',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForCategoryTree'
        ]);

        // Setup mock network interactions
        interceptStoreRequests(secondStore.viewOne.storeCode);
        interceptRouteDataRequests(secondStore.viewOne.storeCode);

        // Switch to second store view
        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        //Setup network mock network requests for the first category page
        interceptCategoryAPageRequests(secondStore.viewOne.storeCode);

        selectCategoryFromMegaMenu(secondStore.categories[0]);

        // Make sure we are using the mock data for the second store products
        assertProductsFound();

        assertNumberOfProductsListed(subcategoryAProducts.length);

        subcategoryAProducts.forEach(productName => {
            assertProductIsInGallery(productName);
        });

        // Setup network interactions for second category
        interceptCategoryBPageRequests(secondStore.viewOne.storeCode);

        // Visit second category
        selectCategoryFromMegaMenu(secondStore.categories[1]);

        // These are no products assigned to Subcategory B in the mock data
        assertNoProductsFound();
    });
});

describe('shopping cart', () => {
    it('lets users add products to cart regardless of store view', () => {
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);

        // Visit default store and add a product
        cy.visitPage('/');

        interceptAccessoriesPageRequests(defaultStore.defaultView.storeCode);

        selectCategoryFromMegaMenu(defaultStore.categories[3]);

        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(
                defaultStore.defaultView.storeCode
            );
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart1.json`
            });
        }).as('mockAddItemToCart');

        interceptCartDataRequests(1, defaultStore.defaultView.storeCode);

        addProductToCartFromCategoryPage(defaultAccessoriesProducts[1]);

        cy.wait(['@mockAddItemToCart']);

        assertCartTriggerCount(1);
        assertProductInList(defaultAccessoriesProducts[1]);

        cy.wait([
            '@getMockItemCount',
            '@getMockAuthedUserCheck',
            '@getMockMiniCart'
        ]);

        // Visit View 1 from default store and add product
        interceptStoreRequests(defaultStore.viewOne.storeCode);
        interceptRouteDataRequests(defaultStore.viewOne.storeCode);

        // Setup cart endpoint responses
        interceptCartDataRequests(1, defaultStore.viewOne.storeCode);

        interceptAccessoriesPageRequests(defaultStore.viewOne.storeCode);

        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${defaultStore.groupName} - ${defaultStore.viewOne.storeName}`
        );

        cy.wait([
            '@getMockAccessoriesCategory',
            '@mockAccessoriesRouteData',
            '@getMockProductFilter',
            '@getMockFilterInput',
            '@getMockAccessoryBreadcrumbs',
            '@getMockCategoryData',
            '@getMockStoreConfigDataForGalleryAC'
        ]);

        assertProductsFound();

        // Add second item to cart
        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(defaultStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart2.json`
            });
        }).as('mockAddItemToCart2');
        interceptCartDataRequests(2, defaultStore.viewOne.storeCode);

        addProductToCartFromCategoryPage(defaultAccessoriesProducts[2]);

        cy.wait('@mockAddItemToCart2');

        assertCartTriggerCount(2);

        assertProductInList(defaultAccessoriesProducts[2]);

        // Visit View 1 B from Store B
        interceptStoreRequests(secondStore.viewOne.storeCode);
        interceptRouteDataRequests(secondStore.viewOne.storeCode);

        interceptCartDataRequests(2, secondStore.viewOne.storeCode);

        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);

            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);

            if (
                url.pathname === accessoriesPathname ||
                url.pathname ===
                    `/${secondStore.viewOne.storeCode}${accessoriesPathname}`
            ) {
                req.alias = 'getMockAccessoriesRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/storeB/accessoriesRoute.json`
                });
            }
        });

        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        cy.wait('@getMockAccessoriesRouteData');

        assertErrorInPage();

        // Go to first category
        interceptCategoryAPageRequests(secondStore.viewOne.storeCode);

        selectCategoryFromMegaMenu(secondStore.categories[0]);

        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart3.json`
            });
        }).as('mockAddItemToCart3');

        interceptCartDataRequests(3, secondStore.viewOne.storeCode);

        // Add third item to cart
        assertProductsFound();
        addProductToCartFromCategoryPage(subcategoryAProducts[1]);

        cy.wait(['@mockAddItemToCart3']);

        // Make sure we have 3 products added to cart
        assertCartTriggerCount(3);
        assertProductInList(subcategoryAProducts[1]);

        // Setup mock network responses for the cart page
        interceptCartPageRequests(secondStore.viewOne.storeCode);

        // Navigate to the cart page
        triggerMiniCart();
        goToCartPageFromEditCartButton();

        cy.wait(['@getMockProductListing']);

        // Assert we have the correct items in the cart
        assertProductInCartPage(defaultAccessoriesProducts[1]);
        assertProductInCartPage(defaultAccessoriesProducts[2]);
        assertProductInCartPage(subcategoryAProducts[1]);
    });
});
