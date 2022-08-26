import {
    categoryPage as categoryPageFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures,
    homePage as homePageFixtures,
    pageBuilder as pageBuilderFixtures
} from '../../../fixtures';
import {
    categoryPage as categoryPageActions,
    header as headerActions,
    pageBuilder as pageBuilderActions
} from '../../../actions';
import { categoryPage as categoryPageAssertions } from '../../../assertions';

const {
    categoryAccessories,
    categoryBelts,
    categoryBottoms,
    categoryShopTheLook,
    categorySkirts
} = categoryPageFixtures;
const { homePage } = homePageFixtures;
const { getCategoryDataCall, getCMSPage } = graphqlMockedCallsFixtures;
const { buttonShopNow } = pageBuilderFixtures;

const {
    selectCategoryFromTree,
    hoverCategoryFromMegaMenu,
    selectCategoryFromMegaMenu
} = categoryPageActions;
const { toggleHeaderNav, closeAppMask } = headerActions;
const { clickOnBannerElementContaining } = pageBuilderActions;

const {
    assertCategoryTitle,
    assertCategoryInTree,
    assertCategoryInMegaMenu
} = categoryPageAssertions;

describe(
    'PWA-1409: verify category access',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@category'] },
    () => {
        it('user should be able to access the Categories via Home page and from Main Menu left drawer', () => {
            cy.intercept('GET', getCategoryDataCall).as(
                'getCategoryDataCallQuery'
            );
            cy.intercept('GET', getCMSPage).as('gqlGetCMSPageQuery');

            const getNavigationMenuCall =
                '**/graphql?query=query+GetNavigationMenu*';
            cy.intercept('GET', getNavigationMenuCall).as(
                'gqlGetNavigationMenuQuery'
            );

            // Test - Mobile Navigation
            cy.viewport(375, 812);
            cy.visit(homePage);

            cy.wait(['@gqlGetCMSPageQuery'], {
                timeout: 60000
            });

            toggleHeaderNav();
            selectCategoryFromTree(categoryBottoms);
            assertCategoryInTree(categorySkirts);

            // Test - Desktop Navigation
            closeAppMask();
            cy.viewport(1280, 1024);

            hoverCategoryFromMegaMenu(categoryAccessories.name);
            assertCategoryInMegaMenu(categoryBelts);
            selectCategoryFromMegaMenu(categoryBelts);

            cy.wait(['@getCategoryDataCallQuery'], {
                timeout: 60000
            });

            assertCategoryTitle(categoryBelts);

            // Test - Navigation from CMS Content
            cy.visit(homePage);

            cy.wait(['@gqlGetCMSPageQuery'], {
                timeout: 60000
            });

            clickOnBannerElementContaining(buttonShopNow);

            cy.wait(['@getCategoryDataCallQuery'], {
                timeout: 60000
            });

            assertCategoryTitle(categoryShopTheLook);
        });
    }
);
