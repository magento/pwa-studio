import { selectCategoryFromMegaMenu } from '../../../actions/categoryPage';
import {
    selectStoreView,
    toggleHeaderStoreSwitcher
} from '../../../actions/storeSwitcher';
import {
    assertNoProductsFound,
    assertNumberOfProductsListed,
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
import { getCategoriesCall } from '../../../fixtures/graphqlMockedCalls';
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
    getStoreConfigForCategoryTreeCall
} = graphqlMockedCallsFixtures;

const DATA_DIRECTORY = 'multiStore/data';

const getFixtureLocationPrefix = req => {
    const {
        headers: { store }
    } = req;
    switch (store) {
        case 'view_1_b':
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
            expect(req.headers.store).to.equal('default');
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

        // There are only 4 categories for the default store in the mock data
        assertNumberOfCategoriesInMegaMenu(4);
        assertNumberOfCategoriesInCategoryTree(4);

        // Verify default categories are listed in the MegaMenu component
        assertCategoryInMegaMenu('Tops');
        assertCategoryInMegaMenu('Bottoms');
        assertCategoryInMegaMenu('Dresses');
        assertCategoryInMegaMenu('Accessories');

        //Verify default categories are listed in the CategoryTree navigation
        assertCategoryInCategoryTree('Tops');
        assertCategoryInCategoryTree('Bottoms');
        assertCategoryInCategoryTree('Dresses');
        assertCategoryInCategoryTree('Accessories');
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

        selectCategoryFromMegaMenu('Accessories');

        cy.intercept(
            getCategoriesCall,
            getInterceptHandler('accessoriesCategory')
        ).as('getMockAccessoriesCategory');

        cy.wait('@getMockAccessoriesCategory');

        assertProductsFound();

        // There are only 3 accessories for the default store in the mock data
        assertNumberOfProductsListed(3);
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
            expect(req.headers.store).to.equal('view_1_b');
            req.reply({
                fixture: `${DATA_DIRECTORY}/availableStores.json`
            });
        });

        selectStoreView('Store B - View One B');

        // There are only 2 categories for Store B in the mock data
        assertNumberOfCategoriesInMegaMenu(2);
        assertNumberOfCategoriesInCategoryTree(2);

        // Verify Store B categories are listed in the MegaMenu component
        assertCategoryInMegaMenu('Subcategory A');
        assertCategoryInMegaMenu('Subcategory B');

        //Verify Store B categories are listed in the CategoryTree navigation
        assertCategoryInCategoryTree('Subcategory A');
        assertCategoryInCategoryTree('Subcategory B');
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

        selectStoreView('Store B - View One B');

        cy.intercept(getCategoriesCall, getInterceptHandler('subcategoryA')).as(
            'getMockSubcategoryACategory'
        );

        selectCategoryFromMegaMenu('Subcategory A');

        cy.wait('@getMockSubcategoryACategory');

        // There are only 2 products assigned to Subcategory A in the mock data
        assertProductsFound();

        assertNumberOfProductsListed(2);

        cy.intercept(getCategoriesCall, getInterceptHandler('subcategoryB')).as(
            'getMockSubcategoryBCategory'
        );

        selectCategoryFromMegaMenu('Subcategory B');

        cy.wait('@getMockSubcategoryBCategory');

        // These are no products assigned to Subcategory B in the mock data
        assertNoProductsFound();
    });
});
