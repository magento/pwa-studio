import {
    addProductToCartFromCategoryPage,
    selectCategoryFromMegaMenu
} from '../../../actions/categoryPage';
import {
    goToCartPageFromEditCartButton,
    triggerMiniCart
} from '../../../actions/miniCart';
import {
    addToCartFromProductPage,
    selectOptionsFromProductPage,
    setProductSizeOption,
    setProductColorOption
} from '../../../actions/productPage';
import {
    selectStoreView,
    toggleHeaderStoreSwitcher
} from '../../../actions/storeSwitcher';

import { assertUrlSuffix, assertNoUrlSuffix } from '../../../assertions/app';
import {
    assertProductInCartPage,
    assertProductImageDisplayedInCartPage
} from '../../../assertions/cartPage';

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
import {
    assertProductInList,
    assertProductImageDisplayed
} from '../../../assertions/miniCart';
import { assertErrorInPage } from '../../../assertions/notFoundPage';
import { assertImageUrlContainsBaseUrl } from '../../../assertions/pageBuilder';

import {
    checkUserIsAuthedCall,
    getBreadcrumbsCall,
    getCartDetailsCall,
    getCategoryAvailableSortMethodsCall,
    getCategoryDataCall,
    getConfigurableThumbnailSourceCall,
    getCMSPage,
    getCurrencyDataCall,
    getFilterInputsForCategoryCall,
    getItemCountCall,
    getPageSizeCall,
    getPriceSummaryCall,
    getProductFiltersByCategoryCall,
    getProductsByUrlKeyCall,
    getRouteDataCall,
    getStoreConfigDataForGalleryEECall,
    getStoreConfigForBreadcrumbsCall,
    getStoreConfigForCarouselEECall,
    getStoreConfigForCartPageCall,
    getWishlistConfigForProductPageCall,
    hitGraphqlPath,
    miniCartQueryCall,
    resolveUrlCall,
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
    getShippingMethodsCall,
    getProductDetailForProductPageCall,
    getStoreConfigForGiftOptionsCall
} from '../../../fixtures/graphqlMockedCalls';
import {
    defaultAccessoriesProducts,
    defaultTopsProducts,
    defaultStore,
    secondStore,
    subcategoryAPathname,
    subcategoryAProducts,
    subcategoryBPathname
} from '../../../fixtures/multiStore';

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

        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/cart-${items}.json`
        });
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
        'GET',
        getCategoriesCall,
        getInterceptHandler('accessoriesCategory', expectedStoreCode)
    ).as('getMockCategories');
    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('accessoriesCategory', expectedStoreCode)
    ).as('getMockBreadcrumbs');
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
 * specific to the tops category page
 *
 * @param {String} expectedStoreCode
 */
const interceptTopsPageRequests = expectedStoreCode => {
    cy.intercept(
        'GET',
        getCategoriesCall,
        getInterceptHandler('topsCategory', expectedStoreCode)
    ).as('getMockCategories');
    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('topsCategory', expectedStoreCode)
    ).as('getMockBreadcrumbs');
    cy.intercept(
        'GET',
        getCategoryDataCall,
        getInterceptHandler('topsCategory', expectedStoreCode)
    ).as('getMockCategoryData');

    cy.intercept('GET', getProductFiltersByCategoryCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/default/topsProductFilters.json`
        });
    }).as('getMockProductFilter');
    cy.intercept('GET', getFilterInputsForCategoryCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/default/topsFilterInputs.json`
        });
    }).as('getMockFilterInput');
};

/**
 * Setup network intercepts that return mocked data for requests
 * specific to the product 1 product page
 *
 * @param {String} expectedStoreCode
 */
const interceptProduct1PageRequests = expectedStoreCode => {
    cy.intercept(
        getProductDetailForProductPageCall,
        getInterceptHandler('product1ProductDetail', expectedStoreCode)
    ).as('getMockProduct1Detail');
    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('product1Breadcrumbs', expectedStoreCode)
    ).as('getMockProduct1Breadcrumbs');
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
 * specific to the product 2 product page
 *
 * @param {String} expectedStoreCode
 */
const interceptProduct2PageRequests = expectedStoreCode => {
    cy.intercept(
        getProductDetailForProductPageCall,
        getInterceptHandler('product2ProductDetail', expectedStoreCode)
    ).as('getMockProduct2Detail');
    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('product2Breadcrumbs', expectedStoreCode)
    ).as('getMockProduct2Breadcrumbs');
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

    // Requests for Category Available Sort Methods
    cy.intercept('GET', getCategoryAvailableSortMethodsCall, req => {
        expect(req.headers.store).to.equal(expectedStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/availableSortMethods.json`
        });
    }).as('getMockAvailableSortMethods');

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
            alias: 'getMockConfigurableThumbnailSource',
            call: getConfigurableThumbnailSourceCall
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
            alias: 'getMockStoreConfigForCarouselEE',
            call: getStoreConfigForCarouselEECall
        },
        {
            alias: 'getMockWishlistConfigForProductPage',
            call: getWishlistConfigForProductPageCall
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
            alias: 'getMockStoreConfigDataForGalleryEE',
            call: getStoreConfigDataForGalleryEECall
        },
        {
            alias: 'getMockStoreConfigForGiftOptions',
            call: getStoreConfigForGiftOptionsCall
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
        const { headers, query } = req;
        const url = JSON.parse(query.variables.toString()).url;

        expect(headers.store).to.equal(expectedStoreCode);

        switch (url) {
            case '/':
                req.alias = 'mockHomeRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/homeRoute.json`
                });
                break;
            case defaultStore.accessoriesPathname:
                req.alias = 'mockAccessoriesRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/default/accessoriesRoute.json`
                });
                break;
            case defaultStore.topsPathname:
                req.alias = 'mockTopsRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/default/topsRoute.json`
                });
                break;
            case defaultStore.product1Pathname:
                req.alias = 'mockProduct1RouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/default/product1Route.json`
                });
                break;
            case secondStore.accessoriesPathname:
                req.alias = 'getMockAccessoriesRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/storeB/accessoriesRoute.json`
                });
                break;
            case subcategoryAPathname:
                req.alias = 'mockSubcategoryARouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/storeB/subcategoryARoute.json`
                });
                break;
            case subcategoryBPathname:
                req.alias = 'mockSubcategoryBRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/storeB/subcategoryBRoute.json`
                });
                break;
            case secondStore.product2Pathname:
                req.alias = 'mockProduct2RouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/storeB/product2Route.json`
                });
                break;
        }
    });
};

describe('default store', () => {
    it('contains valid CMS Page data', () => {
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@getMockMegaMenu',
            '@getMockNavigationMenu',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForCategoryTree'
        ]);

        // Should not have any url suffix
        assertNoUrlSuffix();

        // Images should load properly
        assertImageUrlContainsBaseUrl();
    });

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

        cy.wait('@getMockCategories');

        assertUrlSuffix();
        assertProductsFound();

        // Assertions to make sure we are using the mock data for accessories
        assertNumberOfProductsListed(defaultAccessoriesProducts.length);

        defaultAccessoriesProducts.forEach(productName => {
            assertProductIsInGallery(productName);
        });
    });
});

describe('switching to another store', () => {
    it('contains valid CMS Page data specific to the different store', () => {
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@getMockCmsPage',
            '@getMockProductCarousel',
            '@getMockMegaMenu',
            '@getMockNavigationMenu'
        ]);

        // Setup network interactions for the second store view
        interceptStoreRequests(secondStore.viewOne.storeCode);
        interceptRouteDataRequests(secondStore.viewOne.storeCode);

        // Switch to second store view
        toggleHeaderStoreSwitcher();
        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        cy.wait([
            '@getMockCmsPage',
            '@getMockProductCarousel',
            '@getMockMegaMenu',
            '@getMockNavigationMenu'
        ]);

        // Should not have any url suffix
        assertNoUrlSuffix();

        // Images should load properly
        assertImageUrlContainsBaseUrl();
    });

    it('shows categories specific to the different store', () => {
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@getMockCmsPage',
            '@getMockProductCarousel',
            '@getMockMegaMenu',
            '@getMockNavigationMenu'
        ]);

        // Setup network interactions for the second store view
        interceptStoreRequests(secondStore.viewOne.storeCode);
        interceptRouteDataRequests(secondStore.viewOne.storeCode);

        // Switch to second store view
        toggleHeaderStoreSwitcher();
        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        cy.wait([
            '@getMockCmsPage',
            '@getMockProductCarousel',
            '@getMockMegaMenu',
            '@getMockNavigationMenu'
        ]);

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

        cy.wait([
            '@getMockCmsPage',
            '@getMockProductCarousel',
            '@getMockMegaMenu',
            '@getMockNavigationMenu'
        ]);

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
            '@getMockCmsPage',
            '@getMockProductCarousel',
            '@getMockMegaMenu',
            '@getMockNavigationMenu'
        ]);

        // Setup mock network interactions
        interceptStoreRequests(secondStore.viewOne.storeCode);
        interceptRouteDataRequests(secondStore.viewOne.storeCode);

        // Switch to second store view
        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        cy.wait([
            '@getMockCmsPage',
            '@getMockProductCarousel',
            '@getMockMegaMenu',
            '@getMockNavigationMenu'
        ]);

        //Setup network mock network requests for the first category page
        interceptCategoryAPageRequests(secondStore.viewOne.storeCode);

        selectCategoryFromMegaMenu(secondStore.categories[0]);

        // Make sure we are using the mock data for the second store products
        assertNoUrlSuffix();
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
        assertNoUrlSuffix();
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

        // View 1 - Accessories Category
        interceptAccessoriesPageRequests(defaultStore.viewOne.storeCode);

        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${defaultStore.groupName} - ${defaultStore.viewOne.storeName}`
        );

        cy.wait([
            '@getMockCategories',
            '@getMockBreadcrumbs',
            '@getMockCategoryData',
            '@getMockProductFilter',
            '@getMockFilterInput'
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

        // View 1 - Tops Category
        interceptTopsPageRequests(defaultStore.viewOne.storeCode);

        selectCategoryFromMegaMenu(defaultStore.categories[0]);

        cy.wait(['@mockTopsRouteData']);

        // View 1 - Product 1 Detail Page
        interceptProduct1PageRequests(defaultStore.viewOne.storeCode);

        addProductToCartFromCategoryPage(defaultTopsProducts[0]);

        cy.wait(['@mockProduct1RouteData']);

        selectOptionsFromProductPage();

        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(defaultStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart3.json`
            });
        }).as('mockAddItemToCart3');
        interceptCartDataRequests(3, defaultStore.viewOne.storeCode);

        addToCartFromProductPage();

        cy.wait('@mockAddItemToCart3');

        // Make sure we have 3 products added to cart
        assertCartTriggerCount(3);

        assertProductInList(defaultTopsProducts[0]);

        // Visit View 1 B from Store B
        selectCategoryFromMegaMenu(defaultStore.categories[3]);

        interceptStoreRequests(secondStore.viewOne.storeCode);
        interceptRouteDataRequests(secondStore.viewOne.storeCode);

        interceptCartDataRequests(3, secondStore.viewOne.storeCode);

        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        cy.wait([
            '@getMockCategories',
            '@getMockBreadcrumbs',
            '@getMockCategoryData',
            '@getMockProductFilter',
            '@getMockFilterInput'
        ]);

        assertErrorInPage();

        // Go to first category
        interceptCategoryAPageRequests(secondStore.viewOne.storeCode);

        selectCategoryFromMegaMenu(secondStore.categories[0]);

        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart4.json`
            });
        }).as('mockAddItemToCart4');

        interceptCartDataRequests(4, secondStore.viewOne.storeCode);

        interceptProduct2PageRequests(secondStore.viewOne.storeCode);

        // Add third item to cart
        assertProductsFound();
        addProductToCartFromCategoryPage(subcategoryAProducts[1]);

        cy.wait(['@mockProduct2RouteData']);

        setProductColorOption('Khaki');
        setProductSizeOption('M');
        addToCartFromProductPage();

        cy.wait(['@mockAddItemToCart4']);

        // Make sure we have 4 products added to cart
        assertCartTriggerCount(4);
        assertProductInList(subcategoryAProducts[1]);

        // Setup mock network responses for the cart page
        interceptCartPageRequests(secondStore.viewOne.storeCode);

        // Open MiniCart
        triggerMiniCart();

        // Assert correct product image urls
        assertProductImageDisplayed('va14-ts_main', 0);
        assertProductImageDisplayed('va13-sg_main', 1);
        assertProductImageDisplayed('vsw01-pe_main_1', 2);
        assertProductImageDisplayed('va03-kh_main_1', 3);

        // Navigate to the cart page
        goToCartPageFromEditCartButton();

        cy.wait(['@getMockProductListing']);

        // Assert we have the correct items in the cart
        assertProductInCartPage(defaultAccessoriesProducts[1]);
        assertProductInCartPage(defaultAccessoriesProducts[2]);
        assertProductInCartPage(defaultTopsProducts[0]);
        assertProductInCartPage(subcategoryAProducts[1]);

        // Test image source
        assertProductImageDisplayedInCartPage('vsw01-pe_main_1', 2);
        assertProductImageDisplayedInCartPage('va03-kh_main_1', 3);

        // Visit back View 1 from default store and validate store config
        interceptStoreRequests(defaultStore.defaultView.storeCode);
        interceptRouteDataRequests(defaultStore.defaultView.storeCode);
        interceptCartDataRequests(4, defaultStore.defaultView.storeCode);
        interceptCartPageRequests(defaultStore.defaultView.storeCode);

        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${defaultStore.groupName} - ${defaultStore.defaultView.storeName}`
        );

        cy.wait(['@getMockProductListing']);

        // Test if image source has changed
        assertProductImageDisplayedInCartPage('vsw01-rn_main_2', 2);
        assertProductImageDisplayedInCartPage('va03-ly_main_2', 3);
    });
});
