import {
    categoryPageSelectedWishlistButton,
    categoryTreeBranchTarget,
    categoryTreeLeafTarget,
    megaMenuMegaMenuItemLink,
    megaMenuSubmenuColumnLink,
    categoryContentTitle,
    productsGalleryItemName,
    productsNoProductsFound,
    productsPagination,
    productsPaginationTileActive,
    productRatingSummary,
    productSortSortItemActive,
    searchBarSuggestedProduct,
    searchBarSuggestedProductImage,
    filterSidebarHeaderTitle,
    categoryPageAddToCartButton,
    filterSidebarShowMoreLessButton,
    productSortButton,
    productSortSortItem,
    productPrice,
    sharedFilterElements,
    filterListItemElement,
    categoryContentInfo,
    filterRadioRoot,
    filterDefaultRadioElement
} from '../../fields/categoryPage';

import { validateLanguage } from '../../utils/language-test-utils';
import { toggleFilterBlock } from '../../actions/categoryPage';

/**
 * Utility function to assert selected product in wishlist
 */
export const assertWishlistSelectedProductOnCategoryPage = selectedProduct => {
    // assert product selected indicator
    cy.contains(selectedProduct)
        .siblings()
        .find(categoryPageSelectedWishlistButton)
        .should('exist');
};

/**
 * Assert Category Title
 *
 * @param {String} categoryName category name
 */
export const assertCategoryTitle = categoryName => {
    cy.get(categoryContentTitle).should('contain', categoryName);
};

/**
 * Assert Category Tree contains a Category
 *
 * @param {String} categoryName category name
 */
export const assertCategoryInTree = categoryName => {
    cy.get(`${categoryTreeBranchTarget}, ${categoryTreeLeafTarget}`)
        .should('be.visible')
        .and('contain', categoryName);
};

/**
 * Assert Mega Menu contains a Category
 *
 * @param {String} categoryName category name
 */
export const assertCategoryInMegaMenu = categoryName => {
    cy.get(`${megaMenuMegaMenuItemLink}, ${megaMenuSubmenuColumnLink}`)
        .should('be.visible')
        .and('contain', categoryName);
};

/**
 * Assert products were found
 */
export const assertProductsFound = () => {
    cy.get(productsNoProductsFound).should('not.exist');
};

/**
 * Assert no products were found
 */
export const assertNoProductsFound = () => {
    cy.get(productsNoProductsFound).should('exist');
};

/**
 * Assert pagination is not present
 */
export const assertNoPagination = () => {
    cy.get(productsPagination).should('not.exist');
};

/**
 * Assert current pagination's active page
 *
 * @param {Number} pageNumber page number
 */
export const assertPaginationActivePage = pageNumber => {
    cy.get(productsPaginationTileActive).should('contain', pageNumber);
};

/**
 * Assert Product is in Gallery
 *
 * @param {String} productName product name
 */
export const assertProductIsInGallery = productName => {
    cy.get(productsGalleryItemName).should('contain', productName);
};

/**
 * Assert Product is in Product Suggestion
 *
 * @param {String} productName product name
 * @param {String} productHref product href
 * @param {Number} [wait] wait period for cache persistence
 */
export const assertProductIsInProductSuggestion = (
    productName,
    productHref,
    wait = 4000
) => {
    cy.get(searchBarSuggestedProduct).should('contain', productName);
    cy.get(searchBarSuggestedProduct).should('be.visible');
    cy.get(searchBarSuggestedProductImage)
        .should('be.visible')
        .then(() => {
            cy.wait(wait);
        });
    cy.get(searchBarSuggestedProduct)
        .invoke('attr', 'href')
        .should('contain', productHref);
};

/**
 * Assert no Product Suggestion
 */
export const assertNoProductSuggestion = () => {
    cy.get(searchBarSuggestedProduct).should('not.exist');
};

/**
 * Assert active Sort Item
 *
 * @param {String} sortLabel product name
 */
export const assertActiveSortItem = sortLabel => {
    cy.get(productSortSortItemActive).should('contain', sortLabel);
};

/**
 * Assert Sort Item not available from list
 *
 * @param {String} sortLabel product name
 */
export const assertNotAvailableSortItem = sortLabel => {
    cy.get(productSortSortItem).should('not.contain', sortLabel);
};

/**
 * Utility function to assert CategoryPage text is in correct language (french or english)
 * @param {String} language -- language to validate (ISO639 codes only, eg. "fra,eng")
 */
export const assertCategoryPageTextLanguage = language => {
    const textToValidate = [];
    cy.get(filterSidebarHeaderTitle).then($title =>
        textToValidate.push($title.text())
    );
    cy.get(categoryPageAddToCartButton)
        .first()
        .then($button => textToValidate.push($button.text().toLowerCase()));
    cy.get(productSortButton).then($button => {
        textToValidate.push($button.text());
        $button.trigger('click');
    });
    cy.get(productSortSortItem).then($item =>
        textToValidate.push($item.text())
    );
    cy.get(filterSidebarShowMoreLessButton).then($button => {
        textToValidate.push($button.text());
        expect(validateLanguage(textToValidate.join(','), language, {})).to.be
            .true;
    });
};

/**
 * Utility function to assert products in CategoryPage displays correct currency.
 *
 * @param {String} currency -- currency code to validate
 */
export const assertCategoryPageProductsHaveCurrency = currency => {
    const currencySymbolMap = {
        USD: '$',
        EUR: '€'
    };
    cy.get(productPrice).should('contain', currencySymbolMap[currency]);
};

/* Assert number of products listed
 *
 * @param {Number} number number of products
 */
export const assertNumberOfProductsListed = number => {
    cy.get(productsGalleryItemName).should('have.length', number);
};

/* Assert number of results
 *
 * @param {Number} number number of products
 */
export const assertNumberOfProductsInResults = () => {
    cy.get(categoryContentInfo).contains(/([0-9]+) Results/);
};

export const assertRatingSummary = productName => {
    cy.contains(productName)
        .children()
        .get(productRatingSummary)
        .should('exist');
};

/**
 * Validate current filter contains
 *
 * @param {String} filterName filter name
 * @param {Boolean} [isMobile] is mobile
 */
export const assertCurrentFilter = (filterName, isMobile = true) => {
    const currentFilters =
        sharedFilterElements[isMobile ? 'mobile' : 'desktop'].currentFilter;

    cy.get(currentFilters).should('contain', filterName);
};

/**
 * Validate current filter does not contain
 *
 * @param {String} filterName filter name
 * @param {Boolean} [isMobile] is mobile
 */
export const assertNotInCurrentFilter = (filterName, isMobile = true) => {
    const currentFilters =
        sharedFilterElements[isMobile ? 'mobile' : 'desktop'].currentFilter;

    cy.get(currentFilters).should('not.contain', filterName);
};

/**
 * Utility function to assert selected filter from list
 *
 * @param {String} filterListName filter list name
 * @param {String} filterLabel filter label
 * @param {Boolean} [isMobile] is mobile
 * @param {Boolean} [state] state
 * @param {Boolean} [isRadio] is radio
 */
export const assertFilterInputState = (
    filterListName,
    filterLabel,
    isMobile = true,
    state = false,
    isRadio = false
) => {
    const filtersFilterBlock =
        sharedFilterElements[isMobile ? 'mobile' : 'desktop'].filterBlock;

    cy.get(filtersFilterBlock)
        .contains(filtersFilterBlock, filterListName)
        .then($filterBlock => {
            // Toggle block if not expanded
            if ($filterBlock.find(filterListItemElement).length === 0) {
                toggleFilterBlock(filterListName, isMobile);
            }

            const checkState = state ? 'be.checked' : 'not.be.checked';

            if (isRadio) {
                cy.wrap($filterBlock)
                    .find(filterListItemElement)
                    .contains(filterRadioRoot, filterLabel)
                    .find(filterDefaultRadioElement)
                    .should(checkState);
            } else {
                cy.wrap($filterBlock)
                    .find(filterListItemElement)
                    .contains(filterListItemElement, filterLabel)
                    .should(checkState);
            }
        });
};

/**
 * Utility function to assert boolean filter from list
 *
 * @param {String} filterListName filter list name
 * @param {Boolean} [isMobile] is mobile
 * @param {Boolean} [boolean] state
 */
export const assertBooleanFilterInputState = (
    filterListName,
    isMobile = true,
    boolean = false
) => {
    assertFilterInputState(filterListName, 'No', isMobile, !boolean, true);
    assertFilterInputState(filterListName, 'Yes', isMobile, boolean, true);
};

/**
 * Utility function to assert unselected boolean filter from list
 *
 * @param {String} filterListName filter list name
 * @param {Boolean} [isMobile] is mobile
 */
export const assertBooleanFilterUnselectedInputState = (
    filterListName,
    isMobile = true
) => {
    assertFilterInputState(filterListName, 'No', isMobile, false, true);
    assertFilterInputState(filterListName, 'Yes', isMobile, false, true);
};
