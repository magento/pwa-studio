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
    getStoreConfigDataForGalleryEECall,
    getStoreConfigForBreadcrumbsCall,
    getStoreConfigForCarouselEECall,
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
import {
    accessoriesRouteData,
    getCartData
} from '../../../fixtures/multiStore/interceptHandlers';
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

const setupMockCartDataRequests = (numItems, targetStoreCode) => {
    cy.intercept(
        'GET',
        getItemCountCall,
        getCartData(numItems, targetStoreCode)
    ).as('getMockItemCount');
    cy.intercept(
        'GET',
        checkUserIsAuthedCall,
        getCartData(numItems, targetStoreCode)
    ).as('getMockAuthedUserCheck');

    cy.intercept(
        'GET',
        miniCartQueryCall,
        getCartData(numItems, targetStoreCode)
    ).as('getMockMiniCart');
};

const setupAccessoriesPageRequests = targetStoreCode => {
    cy.intercept(
        getCategoriesCall,
        getInterceptHandler('accessoriesCategory', targetStoreCode)
    ).as('getMockAccessoriesCategory');

    cy.intercept(
        'GET',
        resolveUrlCall,
        accessoriesRouteData(targetStoreCode)
    ).as('getMockAccessoriesRouteData');

    cy.intercept('GET', getProductFiltersByCategoryCall, req => {
        expect(req.headers.store).to.equal(targetStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/default/accessoriesProductFilters.json`
        });
    }).as('getMockProductFilter');
    cy.intercept('GET', getFilterInputsForCategoryCall, req => {
        expect(req.headers.store).to.equal(targetStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/default/accessoriesFilterInputs.json`
        });
    }).as('getMockFilterInput');

    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('accessoriesCategory', targetStoreCode)
    ).as('getMockAccessoryBreadcrumbs');
    cy.intercept(
        'GET',
        getCategoryDataCall,
        getInterceptHandler('accessoriesCategory', targetStoreCode)
    ).as('getMockCategoryData');
};

const setupCategoryAPageRequests = targetStoreCode => {
    cy.intercept(
        'GET',
        getCategoriesCall,
        getInterceptHandler('subcategoryA', targetStoreCode)
    ).as('getMockSubcategoryACategory');

    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('subcategoryA', targetStoreCode)
    ).as('getMockBreadcrumbsData');
    cy.intercept(
        'GET',
        getCategoryDataCall,
        getInterceptHandler('subcategoryA', targetStoreCode)
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

const setupCategoryBPageRequests = targetStoreCode => {
    cy.intercept(
        'GET',
        getCategoriesCall,
        getInterceptHandler('subcategoryB', targetStoreCode)
    ).as('getMockSubcategoryACategory');

    cy.intercept(
        'GET',
        getBreadcrumbsCall,
        getInterceptHandler('subcategoryB', targetStoreCode)
    ).as('getMockBreadcrumbsData');
    cy.intercept(
        'GET',
        getCategoryDataCall,
        getInterceptHandler('subcategoryB', targetStoreCode)
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

const setupCartPageRequests = headerStoreCode => {
    cy.intercept('GET', getCartDetailsCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/details.json`
        });
    }).as('getMockCartDetails');

    cy.intercept('GET', getAppliedCouponsCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/details.json`
        });
    }).as('getMockAppliedCoupons');

    cy.intercept('GET', getAppliedGiftCardsCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/details.json`
        });
    }).as('getMockAppliedGiftCards');

    cy.intercept('GET', getShippingMethodsCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/details.json`
        });
    }).as('getMockShippingMethods');

    cy.intercept('GET', getPriceSummaryCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/priceSummary.json`
        });
    }).as('getMockPriceSummary');

    cy.intercept('GET', getProductListingCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/productListing.json`
        });
    }).as('getMockProductListing');
};

const setupMockNetworkRequests = headerStoreCode => {
    // Requests for the available stores in the backend
    cy.intercept('GET', getAvailableStoresDataCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/availableStores.json`
        });
    }).as('getMockAvailableStores');

    // Requests for data about the homepage route
    cy.intercept('GET', getRouteDataCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/homeRoute.json`
        });
    }).as('getMockHomeRoute');

    // Requests for currency data
    cy.intercept('GET', getCurrencyDataCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/currency.json`
        });
    }).as('getMockCurrencyData');

    /**
     * Requests for cart data
     */
    cy.intercept('GET', getItemCountCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/empty.json`
        });
    }).as('getMockItemCount');

    cy.intercept('GET', checkUserIsAuthedCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/empty.json`
        });
    }).as('getMockAuthedUserCheck');

    cy.intercept('GET', miniCartQueryCall, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
        req.reply({
            fixture: `${DATA_DIRECTORY}/cart/empty.json`
        });
    }).as('getMockMiniCart');

    // Requests for CMS content
    cy.intercept('GET', getCMSPage, req => {
        expect(req.headers.store).to.equal(headerStoreCode);
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
        getInterceptHandler('megaMenu', headerStoreCode)
    ).as('getMockMegaMenu');

    // Requests for the side nav data
    cy.intercept(
        'GET',
        getNavigationMenuCall,
        getInterceptHandler('navigationMenu', headerStoreCode)
    ).as('getMockNavigationMenu');

    // Requests for the root category of a store
    cy.intercept(
        'GET',
        getRootCategoryIdCall,
        getInterceptHandler('rootCategoryId', headerStoreCode)
    ).as('getMockRootCategoryId');

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
            alias: 'getMockStoreConfigForCarouselEE',
            call: getStoreConfigForCarouselEECall
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
            alias: 'getMockStoreConfigForCartPage',
            call: getStoreConfigForCartPageCall
        }
    ];
    storeConfigRequests.forEach(request => {
        cy.intercept(
            'GET',
            request.call,
            getInterceptHandler('storeConfig', headerStoreCode)
        ).as(request.alias);
    });
};

const setupMockRouteData = storeCode => {
    cy.intercept('GET', resolveUrlCall, req => {
        expect(req.headers.store).to.equal(storeCode);

        const url = new URL(req.headers.referer);

        switch (url.pathname) {
            case '/':
                req.alias = 'mockHomeRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/homeRoute.json`
                });
                break;
            case accessoriesPathname:
                req.alias = 'mockAccessoriesRouteData';
                req.reply({
                    fixture: `${DATA_DIRECTORY}/default/accessoriesRoute.json`
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
        }
    });
};

describe('default store', () => {
    it('displays subcategories from the default root category', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);
        setupMockRouteData(defaultStore.defaultView.storeCode);

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
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);
        setupMockRouteData(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@getMockMegaMenu',
            '@getMockNavigationMenu',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForCategoryTree'
        ]);

        // Setup calls for the accessories page
        setupAccessoriesPageRequests(defaultStore.defaultView.storeCode);

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

describe('Switching to another store', () => {
    it('Shows categories specific to the different store', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);
        setupMockRouteData(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@getMockMegaMenu',
            '@getMockNavigationMenu',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForCategoryTree'
        ]);

        // Setup network interactions for the second store view
        setupMockNetworkRequests(secondStore.viewOne.storeCode);
        setupMockRouteData(secondStore.viewOne.storeCode);

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
        setupMockNetworkRequests(defaultStore.viewOne.storeCode);
        setupMockRouteData(defaultStore.viewOne.storeCode);

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

    it('Shows products specific to the categories in the different store', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);
        setupMockRouteData(defaultStore.defaultView.storeCode);

        cy.visitPage('/');

        cy.wait([
            '@mockHomeRouteData',
            '@getMockMegaMenu',
            '@getMockNavigationMenu',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForCategoryTree'
        ]);

        // Setup mock network interactions
        setupMockNetworkRequests(secondStore.viewOne.storeCode);
        setupMockRouteData(secondStore.viewOne.storeCode);

        // Switch to second store view
        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        //Setup network mock network requests for the first category page
        setupCategoryAPageRequests(secondStore.viewOne.storeCode);

        selectCategoryFromMegaMenu(secondStore.categories[0]);

        // Make sure we are using the mock data for the second store products
        assertProductsFound();

        assertNumberOfProductsListed(subcategoryAProducts.length);

        subcategoryAProducts.forEach(productName => {
            assertProductIsInGallery(productName);
        });

        // Setup network interactions for second category
        setupCategoryBPageRequests(secondStore.viewOne.storeCode);

        // Visit second category
        selectCategoryFromMegaMenu(secondStore.categories[1]);

        // These are no products assigned to Subcategory B in the mock data
        assertNoProductsFound();
    });
});

describe('Shopping cart', () => {
    it('lets users add products to cart regardless of store view', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);
        setupMockRouteData(defaultStore.defaultView.storeCode);

        // Visit default store and add a product
        cy.visitPage('/');

        setupAccessoriesPageRequests(defaultStore.defaultView.storeCode);

        selectCategoryFromMegaMenu(defaultStore.categories[3]);

        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(
                defaultStore.defaultView.storeCode
            );
            const { operationName } = req.body;
            console.log(operationName);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart1.json`
            });
        }).as('mockAddItemToCart');

        setupMockCartDataRequests(1, defaultStore.defaultView.storeCode);

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
        setupMockNetworkRequests(defaultStore.viewOne.storeCode);
        setupMockRouteData(defaultStore.viewOne.storeCode);

        // Setup cart endpoint responses
        setupMockCartDataRequests(1, defaultStore.viewOne.storeCode);

        setupAccessoriesPageRequests(defaultStore.viewOne.storeCode);

        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${defaultStore.groupName} - ${defaultStore.viewOne.storeName}`
        );

        cy.wait[
            ('@getMockAccessoriesCategory',
            '@getMockAccessoriesRouteData',
            '@getMockProductFilter',
            '@getMockFilterInput',
            '@getMockAccessoryBreadcrumbs',
            '@getMockCategoryData')
        ];

        assertProductsFound();

        // Add second item to cart
        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(defaultStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart2.json`
            });
        }).as('mockAddItemToCart2');
        setupMockCartDataRequests(2, defaultStore.viewOne.storeCode);

        addProductToCartFromCategoryPage(defaultAccessoriesProducts[2]);

        cy.wait(['@mockAddItemToCart2']);

        assertCartTriggerCount(2);

        assertProductInList(defaultAccessoriesProducts[2]);

        // Visit View 1 B from Store B
        setupMockNetworkRequests(secondStore.viewOne.storeCode);
        setupMockRouteData(secondStore.viewOne.storeCode);

        setupMockCartDataRequests(2, secondStore.viewOne.storeCode);

        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);

            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);

            if (url.pathname === accessoriesPathname) {
                req.alias = 'getMockAccesiesRouteData';
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
        setupCategoryAPageRequests(secondStore.viewOne.storeCode);

        selectCategoryFromMegaMenu(secondStore.categories[0]);

        cy.wait([
            '@getMockSubcategoryACategory',
            '@getMockBreadcrumbsData',
            '@getMockCategoryData',
            '@getMockProductFilter',
            '@getMockFilterInputs'
        ]);

        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart3.json`
            });
        }).as('mockAddItemToCart3');

        setupMockCartDataRequests(3, secondStore.viewOne.storeCode);

        // Add third item to cart
        addProductToCartFromCategoryPage(subcategoryAProducts[1]);

        cy.wait(['@mockAddItemToCart3']);

        // Make sure we have 3 products added to cart
        assertCartTriggerCount(3);
        assertProductInList(subcategoryAProducts[1]);

        // Navigate to the cart page
        setupCartPageRequests(secondStore.viewOne.storeCode);

        triggerMiniCart();
        goToCartPageFromEditCartButton();

        cy.wait(['@getMockProductListing']);

        // Assert we have the correct items in the cart
        assertProductInCartPage(defaultAccessoriesProducts[1]);
        assertProductInCartPage(defaultAccessoriesProducts[2]);
        assertProductInCartPage(subcategoryAProducts[1]);
    });
});
