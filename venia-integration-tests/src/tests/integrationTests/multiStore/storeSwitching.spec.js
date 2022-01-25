import { goToCheckout } from '../../../actions/cartPage';
import {
    addProductToCartFromCategoryPage,
    selectCategoryFromMegaMenu
} from '../../../actions/categoryPage';
import {
    editCreditCardInformation,
    setGuestShippingAddress,
    submitShippingMethod
} from '../../../actions/checkoutPage';
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
import {
    assertPaymentInformationInCheckoutPage} from '../../../assertions/checkoutPage';
import { assertCartTriggerCount } from '../../../assertions/header';

import {
    assertCategoryInMegaMenu,
    assertNumberOfCategoriesInMegaMenu
} from '../../../assertions/megaMenu';
import { assertProductInList } from '../../../assertions/miniCart';
import {
    assertErrorInPage} from '../../../assertions/notFoundPage';

import {
    accountAccess,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import { accountEmail } from '../../../fixtures/accountAccess';
import { checkoutShippingData } from '../../../fixtures/checkoutPage';
import {
    checkUserIsAuthedCall,
    getBillingAddressCall,
    getBreadcrumbsCall,
    getCartDetailsCall,
    getCategoryDataCall,
    getCheckoutDetailsCall,
    getCMSPage,
    getCountriesCall,
    getCurrencyDataCall,
    getFilterInputsForCategoryCall,
    getIsEmailAvailableCall,
    getItemCountCall,
    getPageSizeCall,
    getPaymentInformationCall,
    getPriceSummaryCall,
    getProductFiltersByCategoryCall,
    getProductsByUrlKeyCall,
    getRegionsCall,
    getRouteDataCall,
    getSelectedAndAvailableShippingMethodsCall,
    getShippingInformationCall,
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
    getCartData,
    homeRouteData,
    subcategoryARouteData
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
        resolveUrlCall,
        subcategoryARouteData(targetStoreCode)
    ).as('getMockSubCategoryARouteData');

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

describe('default store', () => {
    it.skip('displays subcategories from the default root category', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);
        cy.visitPage('/');

        cy.wait([
            '@getMockAvailableStores',
            '@getMockMegaMenu',
            '@getMockRootCategoryId',
            '@getMockNavigationMenu',
            '@getMockStoreConfig',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForContactUs',
            '@getMockStoreConfigForNewsletter',
            '@mockStoreConfig',
            '@getMockStoreConfigForCategoryTree',
            '@getMockLocale',
            '@getMockStoreConfigForMiniCart',
            '@getMockStoreName'
        ]);

        // Assertions to make sure we are using the mock data for categories
        assertNumberOfCategoriesInMegaMenu(defaultStore.categories.length);
        assertNumberOfCategoriesInCategoryTree(defaultStore.categories.length);

        defaultStore.categories.forEach(categoryLabel => {
            assertCategoryInMegaMenu(categoryLabel);
            assertCategoryInCategoryTree(categoryLabel);
        });
    });

    it.skip('displays assigned products', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);
        cy.visitPage('/');

        cy.wait([
            '@getMockAvailableStores',
            '@getMockMegaMenu',
            '@getMockRootCategoryId',
            '@getMockNavigationMenu',
            '@getMockStoreConfig',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForContactUs',
            '@getMockStoreConfigForNewsletter',
            '@mockStoreConfig',
            '@getMockStoreConfigForCategoryTree',
            '@getMockLocale',
            '@getMockStoreConfigForMiniCart',
            '@getMockStoreName'
        ]);

        selectCategoryFromMegaMenu(defaultStore.categories[3]);

        cy.intercept(
            getCategoriesCall,
            getInterceptHandler(
                'accessoriesCategory',
                defaultStore.defaultView.storeCode
            )
        ).as('getMockAccessoriesCategory');

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
    it.skip('Shows categories specific to the different store', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);

        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);
            expect(url.pathname).to.equal('/');
            expect(req.headers.store).to.equal(
                defaultStore.defaultView.storeCode
            );
            req.reply({
                fixture: `${DATA_DIRECTORY}/homeRoute.json`
            });
        });

        cy.visitPage('/');

        cy.wait([
            '@getMockAvailableStores',
            '@getMockMegaMenu',
            '@getMockRootCategoryId',
            '@getMockNavigationMenu',
            '@getMockStoreConfig',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForContactUs',
            '@getMockStoreConfigForNewsletter',
            '@mockStoreConfig',
            '@getMockStoreConfigForCategoryTree',
            '@getMockLocale',
            '@getMockStoreConfigForMiniCart',
            '@getMockStoreName'
        ]);

        // Switch to second store view
        setupMockNetworkRequests(secondStore.viewOne.storeCode);

        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);
            expect(url.pathname).to.equal('/');
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/homeRoute.json`
            });
        });

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

        // Switch to different store one view
        setupMockNetworkRequests(defaultStore.viewOne.storeCode);

        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);
            expect(url.pathname).to.equal('/');
            expect(req.headers.store).to.equal(defaultStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/homeRoute.json`
            });
        });

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

    it.skip('Shows products specific to the categories in the different store', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);

        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);
            expect(url.pathname).to.equal('/');
            expect(req.headers.store).to.equal(
                defaultStore.defaultView.storeCode
            );
            req.reply({
                fixture: `${DATA_DIRECTORY}/homeRoute.json`
            });
        });

        cy.visitPage('/');

        cy.wait([
            '@getMockAvailableStores',
            '@getMockMegaMenu',
            '@getMockRootCategoryId',
            '@getMockNavigationMenu',
            '@getMockStoreConfig',
            '@getMockStoreConfigForMegaMenu',
            '@getMockStoreConfigForContactUs',
            '@getMockStoreConfigForNewsletter',
            '@mockStoreConfig',
            '@getMockStoreConfigForCategoryTree',
            '@getMockLocale',
            '@getMockStoreConfigForMiniCart',
            '@getMockStoreName'
        ]);

        // Switch to second store view
        setupMockNetworkRequests(secondStore.viewOne.storeCode);

        cy.intercept(
            'GET',
            resolveUrlCall,
            homeRouteData(secondStore.viewOne.storeCode)
        ).as('mockedResolvedHomeUrl');

        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        cy.wait('@mockedResolvedHomeUrl');

        // Go to the first category
        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);
            expect(url.pathname).to.equal(subcategoryAPathname);
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/storeB/subcategoryARoute.json`
            });
        }).as('getMockFirstCategoryRouteData');

        cy.intercept('GET', getBreadcrumbsCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/storeB/view-1/subcategoryA.json`
            });
        });
        cy.intercept('GET', getCategoryDataCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/storeB/view-1/subcategoryA.json`
            });
        }).as('mockCategoryData');
        cy.intercept('GET', getProductFiltersByCategoryCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/storeB/subcategoryAProductFilters.json`
            });
        }).as('mockProductFilter');
        cy.intercept('GET', getFilterInputsForCategoryCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/storeB/subcategoryAFilterInputs.json`
            });
        }).as('mockProductFilter');

        cy.intercept(
            'GET',
            getCategoriesCall,
            getInterceptHandler('subcategoryA', secondStore.viewOne.storeCode)
        ).as('getMockSubcategoryACategory');

        selectCategoryFromMegaMenu(secondStore.categories[0]);

        cy.wait([
            '@mockCategoryData',
            '@getMockSubcategoryACategory',
            '@getMockFirstCategoryRouteData'
        ]);

        // Make sure we are using the mock data for the second store products
        assertProductsFound();

        assertNumberOfProductsListed(subcategoryAProducts.length);

        subcategoryAProducts.forEach(productName => {
            assertProductIsInGallery(productName);
        });

        // Visit second category
        cy.intercept(
            getCategoriesCall,
            getInterceptHandler('subcategoryB', secondStore.viewOne.storeCode)
        ).as('getMockSubcategoryBCategory');

        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);
            expect(url.pathname).to.equal(subcategoryBPathname);
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/storeB/subcategoryBRoute.json`
            });
        }).as('getMockSecondaryCategoryRouteData');

        cy.intercept('GET', getBreadcrumbsCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/storeB/view-1/subcategoryB.json`
            });
        });

        selectCategoryFromMegaMenu(secondStore.categories[1]);

        cy.wait([
            '@getMockSubcategoryBCategory',
            '@getMockSecondaryCategoryRouteData'
        ]);

        // These are no products assigned to Subcategory B in the mock data
        assertNoProductsFound();
    });
});

describe('cart and checkout', () => {
    it('lets users add products to cart regardless of store view and checkout', () => {
        setupMockNetworkRequests(defaultStore.defaultView.storeCode);
        // Visit default store and add a product
        cy.visitPage('/');

        selectCategoryFromMegaMenu(defaultStore.categories[3]);

        cy.intercept(
            getCategoriesCall,
            getInterceptHandler(
                'accessoriesCategory',
                defaultStore.defaultView.storeCode
            )
        ).as('getMockAccessoriesCategory');

        cy.wait('@getMockAccessoriesCategory');

        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(
                defaultStore.defaultView.storeCode
            );
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

        setupMockCartDataRequests(2, secondStore.viewOne.storeCode);

        cy.intercept('GET', resolveUrlCall, req => {
            const url = new URL(req.headers.referer);
            expect(url.pathname).to.equal(accessoriesPathname);
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/storeB/accessoriesRoute.json`
            });
        }).as('getMockAccessoriesRouteData');

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
            '@getMockSubCategoryARouteData',
            '@getMockSubcategoryACategory',
            '@getMockBreadcrumbsData',
            '@getMockCategoryData',
            '@getMockProductFilter',
            '@getMockFilterInputs'
        ]);

        // Add third item to cart
        // Intercept calls that update the cart
        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/addProductsToCart3.json`
            });
        }).as('mockAddItemToCart3');

        setupMockCartDataRequests(3, secondStore.viewOne.storeCode);

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

        // Setup checkout page data
        cy.intercept('GET', getCheckoutDetailsCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/details.json`
            });
        }).as('getMockCheckoutDetailsCall');

        cy.intercept('GET', getRouteDataCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/routeData.json`
            });
        }).as('getMockCheckoutRouteData');

        cy.intercept('GET', getShippingInformationCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/details.json`
            });
        }).as('getMockShippingInformation');

        cy.intercept('GET', getCountriesCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/countries.json`
            });
        }).as('getMockCountriesCall');

        cy.intercept('GET', getRegionsCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/regions.json`
            });
        }).as('getMockRegionsCall');

        cy.intercept('GET', getIsEmailAvailableCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/emailAvailable.json`
            });
        }).as('getMockIsEmailAvailable');

        cy.intercept('GET', getSelectedAndAvailableShippingMethodsCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/selectedAvailableShippingMethods.json`
            });
        }).as('getMockSelectedAvailableShippingMethods');

        // Go to checkout page
        goToCheckout();

        const { firstName, lastName } = accountAccess;

        const completeShippingAddress = {
            ...checkoutShippingData.us,
            email: accountEmail,
            firstName,
            lastName
        };

        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/setGuestShipping.json`
            });
        }).as('mockSetGuestShippingOperation');

        setGuestShippingAddress(completeShippingAddress);

        cy.wait([
            '@getMockCountriesCall',
            '@getMockRegionsCall',
            '@mockSetGuestShippingOperation'
        ]);

        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/setShippingMethodOnCart.json`
            });
        }).as('mockSetShippingMethods');

        cy.intercept('GET', getPaymentInformationCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/paymentInformation.json`
            });
        }).as('mockPaymentInformation');

        cy.intercept('GET', getBillingAddressCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/billingAddress.json`
            });
        });

        submitShippingMethod();

        cy.wait(['@mockSetShippingMethods', '@mockPaymentInformation']);

        cy.intercept('POST', hitGraphqlPath, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/checkout/setBillingAddress.json`
            });
        }).as('mockSetBillingAddress');

        assertPaymentInformationInCheckoutPage({
            shortDescription: 'Braintree'
        });

        editCreditCardInformation({
            name: 'John Doe',
            number: '4111111111111111',
            expiration: '01/23',
            cvv: '456'
        });

        cy.intercept('GET', getCheckoutDetailsCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/finalCartDetails.json`
            });
        });
        cy.intercept('GET', getSelectedAndAvailableShippingMethodsCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/finalCartDetails.json`
            });
        });
        cy.intercept('GET', getPaymentInformationCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/cart/finalCartDetails.json`
            });
        });

        //reviewOrder();
    });
});
