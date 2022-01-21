import { selectCategoryFromMegaMenu } from '../../../actions/categoryPage';

import {
    selectStoreView,
    toggleHeaderStoreSwitcher
} from '../../../actions/storeSwitcher';

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
    assertCategoryInMegaMenu,
    assertNumberOfCategoriesInMegaMenu
} from '../../../assertions/megaMenu';

import { graphqlMockedCalls as graphqlMockedCallsFixtures } from '../../../fixtures';
import {
    defaultAccessoriesProducts,
    defaultStore,
    secondStore,
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
    getCategoriesCall
} = graphqlMockedCallsFixtures;

const DATA_DIRECTORY = 'multiStore/data';

const getFixtureLocationPrefix = req => {
    const {
        headers: { store }
    } = req;
    switch (store) {
        case secondStore.viewOne.storeCode:
            return `${DATA_DIRECTORY}/storeB/view-1`;
        default:
            return `${DATA_DIRECTORY}/default`;
    }
};

const getInterceptHandler = filename => {
    const handler = req => {
        req.reply({
            fixture: `${getFixtureLocationPrefix(req)}/${filename}.json`
        });
    };

    return handler;
};

beforeEach(() => {
    cy.intercept('GET', getAvailableStoresDataCall, req => {
        req.reply({
            fixture: `${DATA_DIRECTORY}/availableStores.json`
        });
    }).as('getMockAvailableStores');

    cy.intercept('GET', getMegaMenuCall, getInterceptHandler('megaMenu')).as(
        'getMockMegaMenu'
    );

    cy.intercept(
        'GET',
        getRootCategoryIdCall,
        getInterceptHandler('rootCategoryId')
    ).as('getMockRootCategoryId');

    cy.intercept(
        'GET',
        getNavigationMenuCall,
        getInterceptHandler('navigationMenu')
    ).as('getMockNavigationMenu');

    // Intercept calls for the store config
    cy.intercept(
        'GET',
        getStoreConfigDataCall,
        getInterceptHandler('storeConfig')
    ).as('getMockStoreConfig');

    cy.intercept(
        'GET',
        getStoreConfigForMegaMenuCall,
        getInterceptHandler('storeConfig')
    ).as('getMockStoreConfigForMegaMenu');

    cy.intercept(
        'GET',
        getStoreConfigForContactUsCall,
        getInterceptHandler('storeConfig')
    ).as('getMockStoreConfigForContactUs');

    cy.intercept(
        'GET',
        getStoreConfigForNewsletterCall,
        getInterceptHandler('storeConfig')
    ).as('getMockStoreConfigForNewsletter');

    cy.intercept(
        'GET',
        storeConfigDataCall,
        getInterceptHandler('storeConfig')
    ).as('mockStoreConfig');

    cy.intercept(
        'GET',
        getStoreConfigForCategoryTreeCall,
        getInterceptHandler('storeConfig')
    ).as('getMockStoreConfigForCategoryTree');

    cy.intercept('GET', getLocaleCall, getInterceptHandler('storeConfig')).as(
        'getMockLocale'
    );

    cy.intercept(
        'GET',
        getStoreConfigForMiniCartCall,
        getInterceptHandler('storeConfig')
    ).as('getMockStoreConfigForMiniCart');

    cy.intercept(
        'GET',
        getStoreNameCall,
        getInterceptHandler('storeConfig')
    ).as('getMockStoreName');
});

describe('default store', () => {
    it('displays subcategories from the default root category', () => {
        cy.visitPage('/');

        // App sends default header on initial visit
        cy.intercept(getAvailableStoresDataCall, req => {
            expect(req.headers.store).to.equal(
                defaultStore.defaultView.storeCode
            );
        });

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

    it('displays assigned products', () => {
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
            getInterceptHandler('accessoriesCategory')
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
    it('Shows categories specific to the different store', () => {
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

        toggleHeaderStoreSwitcher();

        // App sends the correct header after switching stores
        cy.intercept(getAvailableStoresDataCall, req => {
            expect(req.headers.store).to.equal(secondStore.viewOne.storeCode);
            req.reply({
                fixture: `${DATA_DIRECTORY}/availableStores.json`
            });
        });

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
    });

    it('Shows products specific to the categories in the different store', () => {
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

        toggleHeaderStoreSwitcher();

        selectStoreView(
            `${secondStore.groupName} - ${secondStore.viewOne.storeName}`
        );

        cy.intercept(getCategoriesCall, getInterceptHandler('subcategoryA')).as(
            'getMockSubcategoryACategory'
        );

        selectCategoryFromMegaMenu(secondStore.categories[0]);

        cy.wait('@getMockSubcategoryACategory');

        // There are only 2 products assigned to Subcategory A in the mock data
        assertProductsFound();

        assertNumberOfProductsListed(2);

        cy.intercept(getCategoriesCall, getInterceptHandler('subcategoryB')).as(
            'getMockSubcategoryBCategory'
        );

        selectCategoryFromMegaMenu(secondStore.categories[1]);

        cy.wait('@getMockSubcategoryBCategory');

        // These are no products assigned to Subcategory B in the mock data
        assertNoProductsFound();
    });
});
