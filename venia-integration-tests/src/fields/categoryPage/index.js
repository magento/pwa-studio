export const categoryPageAddToWishListButton =
    '*[data-cy="addToListButton-root"]';

export const categoryPageSelectedWishlistButton =
    '*[data-cy="addToListButton-root"]';

export const categoryContentTitle = '[data-cy="CategoryContent-categoryTitle"]';

export const filterButton = 'button[class^="category-filterButton"]';

export const sharedFilterElements = {
    mobile: {
        clearButton: '[data-cy="FilterModal-clearButton"]',
        currentFilter:
            '[data-cy="FilterModal-root"] [data-cy="CurrentFilter-root"]',
        filterBlock:
            '[data-cy="FilterModal-root"] [data-cy="FilterBlock-root"]',
        filterBlockTriggerButton:
            '[data-cy="FilterModal-root"] [data-cy="FilterBlock-triggerButton"]'
    },
    desktop: {
        clearButton: '[data-cy="FilterSidebar-clearButton"]',
        currentFilter:
            '[data-cy="FilterSidebar-root"] [data-cy="CurrentFilter-root"]',
        filterBlock:
            '[data-cy="FilterSidebar-root"] [data-cy="FilterBlock-root"]',
        filterBlockTriggerButton:
            '[data-cy="FilterSidebar-root"] [data-cy="FilterBlock-triggerButton"]'
    }
};

export const filterModalFilterFooterButton =
    '[data-cy="FilterModal-root"] [data-cy="FilterFooter-button"]';

export const createWishlistButton = '[data-cy="WishlistDialog-createButton"]';

export const wishlistNameField = '[data-cy="createWishlistForm-listname"]';

export const createWishlistConfirmButton =
    '[data-cy="createWishListForm-saveButton"]';

export const categoryPageAddToCartButton =
    '[data-cy="AddToCartButton-buttonInStock"]';

export const categoryTreeBranchTarget =
    '[data-cy="CategoryTree-root"] [data-cy="CategoryTree-Branch-target"]';

export const categoryTreeLeafTarget =
    '[data-cy="CategoryTree-root"] [data-cy="CategoryTree-Leaf-target"]';

export const megaMenuMega = '[data-cy="MegaMenu-megaMenu"]';

export const megaMenuMegaMenuItem =
    '[data-cy="MegaMenu-megaMenu"] [data-cy="MegaMenu-MegaMenuItem-megaMenuItem"]';

export const megaMenuMegaMenuItemLink =
    '[data-cy="MegaMenu-megaMenu"] [data-cy="MegaMenu-MegaMenuItem-link"]';

export const megaMenuSubmenuColumnLink =
    '[data-cy="MegaMenu-megaMenu"] [data-cy="MegaMenu-SubmenuColumn-link"]';

export const productsGalleryItemName =
    '[data-cy="CategoryContent-root"] [data-cy="GalleryItem-name"], [data-cy="SearchPage-root"] [data-cy="GalleryItem-name"]';

export const productsNoProductsFound =
    '[data-cy="CategoryContent-root"] [data-cy="NoProductsFound-root"], [data-cy="SearchPage-noResult"]';

export const productsPagination =
    '[data-cy="CategoryContent-root"] [data-cy="Pagination-root"], [data-cy="SearchPage-root"] [data-cy="Pagination-root"]';

export const productsPaginationTile =
    '[data-cy="CategoryContent-root"] [data-cy="Pagination-root"] [data-cy="Tile-root"], [data-cy="SearchPage-root"] [data-cy="Pagination-root"] [data-cy="Tile-root"]';

export const productsPaginationTileActive =
    '[data-cy="CategoryContent-root"] [data-cy="Pagination-root"] [data-cy="Tile-activeRoot"], [data-cy="SearchPage-root"] [data-cy="Pagination-root"] [data-cy="Tile-activeRoot"]';

export const productsFilterModalOpenButton =
    '[data-cy="CategoryContent-root"] [data-cy="FilterModalOpenButton-button"], [data-cy="SearchPage-root"] [data-cy="FilterModalOpenButton-button"]';

export const productSortButton = '[data-cy="ProductSort-sortButton"]';

export const productSortSortItem =
    '[data-cy="ProductSort-root"] [data-cy="SortItem-button"], [data-cy="ProductSort-root"] [data-cy="SortItem-activeButton"]';

export const productSortSortItemActive =
    '[data-cy="ProductSort-root"] [data-cy="SortItem-activeButton"]';

export const productRatingSummary = '[data-cy="ratingSummary"]';

export const searchBarSuggestedProduct =
    '[data-cy="SearchBar-root"] [data-cy="SuggestedProduct-root"]';

export const searchBarSuggestedProductImage =
    '[data-cy="SuggestedProduct-image"]';

export const searchBarSuggestedProductName =
    '[data-cy="SearchBar-root"] [data-cy="SuggestedProduct-name"]';

// Following elements are used with cy.get(parent).find(element) with a specified parent.
// More specific selectors will break the tests.
export const currentFilterTriggerElement = '[data-cy="CurrentFilter-trigger"]';

export const filterListShowMoreLessButtonElement =
    '[data-cy="FilterList-showMoreLessButton"]';

export const filterListItemElement = '[data-cy="FilterList-item"]';

export const filterDefaultCheckboxElement =
    '[data-cy="FilterDefault-checkbox"]';

export const filterRadioRoot =
    '[data-cy="RadioGroup-root"] label[class^="radio-root-"]';

export const filterDefaultRadioElement = '[data-cy="FilterDefault-radio"]';

export const filterSidebarHeaderTitle =
    '[data-cy="CategoryContent-root"] [data-cy="FilterSidebar-root"] [data-cy="FilterSidebar-headerTitle"]';

export const productPrice =
    '[data-cy="CategoryContent-root"] [data-cy="Gallery-root"] [data-cy="GalleryItem-price"]';

export const categoryContentInfo =
    '[data-cy="CategoryContent-root"] [data-cy="CategoryContent-categoryInfo"]';

export const filterSidebarShowMoreLessButton =
    '[data-cy="CategoryContent-root"] [data-cy="FilterSidebar-root"] [data-cy="FilterList-showMoreLessButton"]';

export const categoryPageProductGalleryItem =
    '[data-cy="CategoryContent-root"] [data-cy="GalleryItem-root"]';
