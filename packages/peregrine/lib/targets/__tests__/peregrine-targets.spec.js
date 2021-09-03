const {
    buildModuleWith,
    mockBuildBus,
    mockTargetProvider
} = require('@magento/pwa-buildpack');
const declare = require('../peregrine-declare');
const intercept = require('../peregrine-intercept');
const targetSerializer = require('../JestPeregrineTargetSerializer');

expect.addSnapshotSerializer(targetSerializer);

test('declares an asyncseries target talons and intercepts transformModules', async () => {
    const targets = mockTargetProvider(
        '@magento/peregrine',
        (_, dep) =>
            ({
                '@magento/pwa-buildpack': {
                    specialFeatures: {
                        tap: jest.fn()
                    },
                    transformModules: {
                        tapPromise: jest.fn()
                    }
                }
            }[dep])
    );
    declare(targets);
    expect(targets.own.talons.tap).toBeDefined();
    const hook = jest.fn();
    // no implementation testing in declare phase
    targets.own.talons.tap('test', hook);
    await targets.own.talons.promise('woah');
    expect(hook).toHaveBeenCalledWith('woah');

    intercept(targets);
    const buildpackTargets = targets.of('@magento/pwa-buildpack');
    expect(buildpackTargets.transformModules.tapPromise).toHaveBeenCalled();
});

test('exposes all hooks and targets', async () => {
    const bus = mockBuildBus({
        context: __dirname,
        dependencies: [
            {
                name: '@magento/peregrine',
                declare,
                intercept
            }
        ]
    });
    bus.init();
    const apis = {};
    const { talons, hooks } = bus.getTargetsOf('@magento/peregrine');
    talons.tap(talonsSet => {
        apis.talons = talonsSet;
    });
    hooks.tap(hooksSet => {
        apis.hooks = hooksSet;
    });
    await bus
        .getTargetsOf('@magento/pwa-buildpack')
        .transformModules.promise(() => {});
    expect(apis.hooks).toMatchInlineSnapshot(`
        HookInterceptorSet API (autogenerated from "@magento/peregrine/lib/hooks"):
          hooks.useAwaitQuery.wrapWith() wraps export "useAwaitQuery" from "useAwaitQuery.js"
          hooks.useCarousel.wrapWith() wraps export "useCarousel" from "useCarousel.js"
          hooks.useCustomerWishlistSkus.useCustomerWishlistSkus.wrapWith() wraps export "useCustomerWishlistSkus" from "useCustomerWishlistSkus/useCustomerWishlistSkus.js"
          hooks.useDetectScrollWidth.wrapWith() wraps export "useDetectScrollWidth" from "useDetectScrollWidth.js"
          hooks.useDropdown.wrapWith() wraps export "useDropdown" from "useDropdown.js"
          hooks.useEventListener.wrapWith() wraps export "useEventListener" from "useEventListener.js"
          hooks.usePagination.wrapWith() wraps export "usePagination" from "usePagination.js"
          hooks.useResetForm.wrapWith() wraps export "useResetForm" from "useResetForm.js"
          hooks.useRestApi.wrapWith() wraps export "useRestApi" from "useRestApi.js"
          hooks.useRestResponse.wrapWith() wraps export "useRestResponse" from "useRestResponse.js"
          hooks.useScrollIntoView.wrapWith() wraps export "useScrollIntoView" from "useScrollIntoView.js"
          hooks.useScrollLock.wrapWith() wraps export "useScrollLock" from "useScrollLock.js"
          hooks.useScrollTopOnChange.wrapWith() wraps export "useScrollTopOnChange" from "useScrollTopOnChange.js"
          hooks.useSearchParam.wrapWith() wraps export "useSearchParam" from "useSearchParam.js"
          hooks.useSort.wrapWith() wraps export "useSort" from "useSort.js"
          hooks.useTypePolicies.wrapWith() wraps export "useTypePolicies" from "useTypePolicies.js"
          hooks.useWindowSize.wrapWith() wraps export "useWindowSize" from "useWindowSize.js"
    `);
    expect(apis.talons).toMatchInlineSnapshot(`
        HookInterceptorSet API (autogenerated from "@magento/peregrine/lib/talons"):
          talons.Accordion.useAccordion.wrapWith() wraps export "useAccordion" from "Accordion/useAccordion.js"
          talons.AccountChip.useAccountChip.wrapWith() wraps export "useAccountChip" from "AccountChip/useAccountChip.js"
          talons.AccountInformationPage.useAccountInformationPage.wrapWith() wraps export "useAccountInformationPage" from "AccountInformationPage/useAccountInformationPage.js"
          talons.AccountMenu.useAccountMenuItems.wrapWith() wraps export "useAccountMenuItems" from "AccountMenu/useAccountMenuItems.js"
          talons.Adapter.useAdapter.wrapWith() wraps export "useAdapter" from "Adapter/useAdapter.js"
          talons.AddToCartDialog.useAddToCartDialog.wrapWith() wraps export "useAddToCartDialog" from "AddToCartDialog/useAddToCartDialog.js"
          talons.AddressBookPage.useAddressBookPage.wrapWith() wraps export "useAddressBookPage" from "AddressBookPage/useAddressBookPage.js"
          talons.App.useApp.wrapWith() wraps export "useApp" from "App/useApp.js"
          talons.AuthBar.useAuthBar.wrapWith() wraps export "useAuthBar" from "AuthBar/useAuthBar.js"
          talons.AuthModal.useAuthModal.wrapWith() wraps export "useAuthModal" from "AuthModal/useAuthModal.js"
          talons.Breadcrumbs.useBreadcrumbs.wrapWith() wraps export "useBreadcrumbs" from "Breadcrumbs/useBreadcrumbs.js"
          talons.CartPage.GiftCards.useGiftCard.wrapWith() wraps export "useGiftCard" from "CartPage/GiftCards/useGiftCard.js"
          talons.CartPage.GiftCards.useGiftCards.wrapWith() wraps export "useGiftCards" from "CartPage/GiftCards/useGiftCards.js"
          talons.CartPage.GiftOptions.useGiftOptions.wrapWith() wraps export "useGiftOptions" from "CartPage/GiftOptions/useGiftOptions.js"
          talons.CartPage.PriceAdjustments.ShippingMethods.useShippingForm.wrapWith() wraps export "useShippingForm" from "CartPage/PriceAdjustments/ShippingMethods/useShippingForm.js"
          talons.CartPage.PriceAdjustments.ShippingMethods.useShippingMethods.wrapWith() wraps export "useShippingMethods" from "CartPage/PriceAdjustments/ShippingMethods/useShippingMethods.js"
          talons.CartPage.PriceAdjustments.ShippingMethods.useShippingRadios.wrapWith() wraps export "useShippingRadios" from "CartPage/PriceAdjustments/ShippingMethods/useShippingRadios.js"
          talons.CartPage.PriceAdjustments.useCouponCode.wrapWith() wraps export "useCouponCode" from "CartPage/PriceAdjustments/useCouponCode.js"
          talons.CartPage.PriceSummary.usePriceSummary.wrapWith() wraps export "usePriceSummary" from "CartPage/PriceSummary/usePriceSummary.js"
          talons.CartPage.ProductListing.EditModal.useEditModal.wrapWith() wraps export "useEditModal" from "CartPage/ProductListing/EditModal/useEditModal.js"
          talons.CartPage.ProductListing.EditModal.useProductForm.wrapWith() wraps export "useProductForm" from "CartPage/ProductListing/EditModal/useProductForm.js"
          talons.CartPage.ProductListing.useProduct.wrapWith() wraps export "useProduct" from "CartPage/ProductListing/useProduct.js"
          talons.CartPage.ProductListing.useProductListing.wrapWith() wraps export "useProductListing" from "CartPage/ProductListing/useProductListing.js"
          talons.CartPage.ProductListing.useQuantity.wrapWith() wraps export "useQuantity" from "CartPage/ProductListing/useQuantity.js"
          talons.CartPage.useCartPage.wrapWith() wraps export "useCartPage" from "CartPage/useCartPage.js"
          talons.CategoryList.useCategoryList.wrapWith() wraps export "useCategoryList" from "CategoryList/useCategoryList.js"
          talons.CategoryList.useCategoryTile.wrapWith() wraps export "useCategoryTile" from "CategoryList/useCategoryTile.js"
          talons.CategoryTree.useCategoryBranch.wrapWith() wraps export "useCategoryBranch" from "CategoryTree/useCategoryBranch.js"
          talons.CategoryTree.useCategoryLeaf.wrapWith() wraps export "useCategoryLeaf" from "CategoryTree/useCategoryLeaf.js"
          talons.CategoryTree.useCategoryTree.wrapWith() wraps export "useCategoryTree" from "CategoryTree/useCategoryTree.js"
          talons.Checkout.Receipt.useReceipt.wrapWith() wraps export "useReceipt" from "Checkout/Receipt/useReceipt.js"
          talons.Checkout.useAddressForm.wrapWith() wraps export "useAddressForm" from "Checkout/useAddressForm.js"
          talons.Checkout.useEditableForm.wrapWith() wraps export "useEditableForm" from "Checkout/useEditableForm.js"
          talons.Checkout.useFlow.wrapWith() wraps export "useFlow" from "Checkout/useFlow.js"
          talons.Checkout.useForm.wrapWith() wraps export "useForm" from "Checkout/useForm.js"
          talons.Checkout.useOverview.wrapWith() wraps export "useOverview" from "Checkout/useOverview.js"
          talons.Checkout.usePaymentsForm.wrapWith() wraps export "usePaymentsForm" from "Checkout/usePaymentsForm.js"
          talons.Checkout.usePaymentsFormItems.wrapWith() wraps export "usePaymentsFormItems" from "Checkout/usePaymentsFormItems.js"
          talons.Checkout.useShippingForm.wrapWith() wraps export "useShippingForm" from "Checkout/useShippingForm.js"
          talons.CheckoutPage.AddressBook.useAddressBook.wrapWith() wraps export "useAddressBook" from "CheckoutPage/AddressBook/useAddressBook.js"
          talons.CheckoutPage.AddressBook.useAddressCard.wrapWith() wraps export "useAddressCard" from "CheckoutPage/AddressBook/useAddressCard.js"
          talons.CheckoutPage.BillingAddress.useBillingAddress.wrapWith() wraps export "useBillingAddress" from "CheckoutPage/BillingAddress/useBillingAddress.js"
          talons.CheckoutPage.GuestSignIn.useGuestSignIn.wrapWith() wraps export "useGuestSignIn" from "CheckoutPage/GuestSignIn/useGuestSignIn.js"
          talons.CheckoutPage.ItemsReview.useItemsReview.wrapWith() wraps export "useItemsReview" from "CheckoutPage/ItemsReview/useItemsReview.js"
          talons.CheckoutPage.OrderConfirmationPage.useCreateAccount.wrapWith() wraps export "useCreateAccount" from "CheckoutPage/OrderConfirmationPage/useCreateAccount.js"
          talons.CheckoutPage.OrderConfirmationPage.useOrderConfirmationPage.wrapWith() wraps export "useOrderConfirmationPage" from "CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage.js"
          talons.CheckoutPage.PaymentInformation.useBraintreeSummary.wrapWith() wraps export "useBraintreeSummary" from "CheckoutPage/PaymentInformation/useBraintreeSummary.js"
          talons.CheckoutPage.PaymentInformation.useCreditCard.wrapWith() wraps export "useCreditCard" from "CheckoutPage/PaymentInformation/useCreditCard.js"
          talons.CheckoutPage.PaymentInformation.useEditModal.wrapWith() wraps export "useEditModal" from "CheckoutPage/PaymentInformation/useEditModal.js"
          talons.CheckoutPage.PaymentInformation.usePaymentInformation.wrapWith() wraps export "usePaymentInformation" from "CheckoutPage/PaymentInformation/usePaymentInformation.js"
          talons.CheckoutPage.PaymentInformation.usePaymentMethods.wrapWith() wraps export "usePaymentMethods" from "CheckoutPage/PaymentInformation/usePaymentMethods.js"
          talons.CheckoutPage.PaymentInformation.useSummary.wrapWith() wraps export "useSummary" from "CheckoutPage/PaymentInformation/useSummary.js"
          talons.CheckoutPage.ShippingInformation.AddressForm.useCustomerForm.wrapWith() wraps export "useCustomerForm" from "CheckoutPage/ShippingInformation/AddressForm/useCustomerForm.js"
          talons.CheckoutPage.ShippingInformation.AddressForm.useGuestForm.wrapWith() wraps export "useGuestForm" from "CheckoutPage/ShippingInformation/AddressForm/useGuestForm.js"
          talons.CheckoutPage.ShippingInformation.useEditModal.wrapWith() wraps export "useEditModal" from "CheckoutPage/ShippingInformation/useEditModal.js"
          talons.CheckoutPage.ShippingInformation.useShippingInformation.wrapWith() wraps export "useShippingInformation" from "CheckoutPage/ShippingInformation/useShippingInformation.js"
          talons.CheckoutPage.useCheckoutPage.wrapWith() wraps export "useCheckoutPage" from "CheckoutPage/useCheckoutPage.js"
          talons.CheckoutPage.useShippingMethod.wrapWith() wraps export "useShippingMethod" from "CheckoutPage/useShippingMethod.js"
          talons.Cms.useCmsPage.wrapWith() wraps export "useCmsPage" from "Cms/useCmsPage.js"
          talons.CommunicationsPage.useCommunicationsPage.wrapWith() wraps export "useCommunicationsPage" from "CommunicationsPage/useCommunicationsPage.js"
          talons.Country.useCountry.wrapWith() wraps export "useCountry" from "Country/useCountry.js"
          talons.CreateAccount.useCreateAccount.wrapWith() wraps export "useCreateAccount" from "CreateAccount/useCreateAccount.js"
          talons.CreateAccountPage.useCreateAccountPage.wrapWith() wraps export "useCreateAccountPage" from "CreateAccountPage/useCreateAccountPage.js"
          talons.FilterModal.useFilterBlock.wrapWith() wraps export "useFilterBlock" from "FilterModal/useFilterBlock.js"
          talons.FilterModal.useFilterFooter.wrapWith() wraps export "useFilterFooter" from "FilterModal/useFilterFooter.js"
          talons.FilterModal.useFilterList.wrapWith() wraps export "useFilterList" from "FilterModal/useFilterList.js"
          talons.FilterModal.useFilterModal.wrapWith() wraps export "useFilterModal" from "FilterModal/useFilterModal.js"
          talons.FilterModal.useFilterState.wrapWith() wraps export "useFilterState" from "FilterModal/useFilterState.js"
          talons.FilterSidebar.useFilterSidebar.wrapWith() wraps export "useFilterSidebar" from "FilterSidebar/useFilterSidebar.js"
          talons.Footer.useFooter.wrapWith() wraps export "useFooter" from "Footer/useFooter.js"
          talons.ForgotPassword.useForgotPassword.wrapWith() wraps export "useForgotPassword" from "ForgotPassword/useForgotPassword.js"
          talons.ForgotPasswordPage.useForgotPasswordPage.wrapWith() wraps export "useForgotPasswordPage" from "ForgotPasswordPage/useForgotPasswordPage.js"
          talons.FormError.useFormError.wrapWith() wraps export "useFormError" from "FormError/useFormError.js"
          talons.Gallery.useAddToCartButton.wrapWith() wraps export "useAddToCartButton" from "Gallery/useAddToCartButton.js"
          talons.Gallery.useGallery.wrapWith() wraps export "useGallery" from "Gallery/useGallery.js"
          talons.Gallery.useGalleryItem.wrapWith() wraps export "useGalleryItem" from "Gallery/useGalleryItem.js"
          talons.Header.useAccountMenu.wrapWith() wraps export "useAccountMenu" from "Header/useAccountMenu.js"
          talons.Header.useAccountTrigger.wrapWith() wraps export "useAccountTrigger" from "Header/useAccountTrigger.js"
          talons.Header.useCartTrigger.wrapWith() wraps export "useCartTrigger" from "Header/useCartTrigger.js"
          talons.Header.useCurrencySwitcher.wrapWith() wraps export "useCurrencySwitcher" from "Header/useCurrencySwitcher.js"
          talons.Header.useHeader.wrapWith() wraps export "useHeader" from "Header/useHeader.js"
          talons.Header.useNavigationTrigger.wrapWith() wraps export "useNavigationTrigger" from "Header/useNavigationTrigger.js"
          talons.Header.useSearchTrigger.wrapWith() wraps export "useSearchTrigger" from "Header/useSearchTrigger.js"
          talons.Header.useStoreSwitcher.wrapWith() wraps export "useStoreSwitcher" from "Header/useStoreSwitcher.js"
          talons.Image.useImage.wrapWith() wraps export "useImage" from "Image/useImage.js"
          talons.Image.usePlaceholderImage.wrapWith() wraps export "usePlaceholderImage" from "Image/usePlaceholderImage.js"
          talons.Image.useResourceImage.wrapWith() wraps export "useResourceImage" from "Image/useResourceImage.js"
          talons.LegacyMiniCart.useBody.wrapWith() wraps export "useBody" from "LegacyMiniCart/useBody.js"
          talons.LegacyMiniCart.useCartOptions.wrapWith() wraps export "useCartOptions" from "LegacyMiniCart/useCartOptions.js"
          talons.LegacyMiniCart.useEditItem.wrapWith() wraps export "useEditItem" from "LegacyMiniCart/useEditItem.js"
          talons.LegacyMiniCart.useEmptyMiniCart.wrapWith() wraps export "useEmptyMiniCart" from "LegacyMiniCart/useEmptyMiniCart.js"
          talons.LegacyMiniCart.useHeader.wrapWith() wraps export "useHeader" from "LegacyMiniCart/useHeader.js"
          talons.LegacyMiniCart.useKebab.wrapWith() wraps export "useKebab" from "LegacyMiniCart/useKebab.js"
          talons.LegacyMiniCart.useLegacyMiniCart.wrapWith() wraps export "useLegacyMiniCart" from "LegacyMiniCart/useLegacyMiniCart.js"
          talons.LegacyMiniCart.useProduct.wrapWith() wraps export "useProduct" from "LegacyMiniCart/useProduct.js"
          talons.MagentoRoute.useMagentoRoute.wrapWith() wraps export "useMagentoRoute" from "MagentoRoute/useMagentoRoute.js"
          talons.MegaMenu.useMegaMenu.wrapWith() wraps export "useMegaMenu" from "MegaMenu/useMegaMenu.js"
          talons.MiniCart.useItem.wrapWith() wraps export "useItem" from "MiniCart/useItem.js"
          talons.MiniCart.useMiniCart.wrapWith() wraps export "useMiniCart" from "MiniCart/useMiniCart.js"
          talons.MyAccount.useMyAccount.wrapWith() wraps export "useMyAccount" from "MyAccount/useMyAccount.js"
          talons.MyAccount.useResetPassword.wrapWith() wraps export "useResetPassword" from "MyAccount/useResetPassword.js"
          talons.Navigation.useNavigation.wrapWith() wraps export "useNavigation" from "Navigation/useNavigation.js"
          talons.Navigation.useNavigationHeader.wrapWith() wraps export "useNavigationHeader" from "Navigation/useNavigationHeader.js"
          talons.OrderHistoryPage.useOrderHistoryPage.wrapWith() wraps export "useOrderHistoryPage" from "OrderHistoryPage/useOrderHistoryPage.js"
          talons.OrderHistoryPage.useOrderRow.wrapWith() wraps export "useOrderRow" from "OrderHistoryPage/useOrderRow.js"
          talons.Pagination.usePagination.wrapWith() wraps export "usePagination" from "Pagination/usePagination.js"
          talons.Password.usePassword.wrapWith() wraps export "usePassword" from "Password/usePassword.js"
          talons.Postcode.usePostcode.wrapWith() wraps export "usePostcode" from "Postcode/usePostcode.js"
          talons.ProductFullDetail.useProductFullDetail.wrapWith() wraps export "useProductFullDetail" from "ProductFullDetail/useProductFullDetail.js"
          talons.ProductImageCarousel.useProductImageCarousel.wrapWith() wraps export "useProductImageCarousel" from "ProductImageCarousel/useProductImageCarousel.js"
          talons.ProductImageCarousel.useThumbnail.wrapWith() wraps export "useThumbnail" from "ProductImageCarousel/useThumbnail.js"
          talons.ProductOptions.useOption.wrapWith() wraps export "useOption" from "ProductOptions/useOption.js"
          talons.ProductOptions.useOptions.wrapWith() wraps export "useOptions" from "ProductOptions/useOptions.js"
          talons.ProductOptions.useSwatch.wrapWith() wraps export "useSwatch" from "ProductOptions/useSwatch.js"
          talons.ProductOptions.useTile.wrapWith() wraps export "useTile" from "ProductOptions/useTile.js"
          talons.Region.useRegion.wrapWith() wraps export "useRegion" from "Region/useRegion.js"
          talons.RootComponents.Category.useCategory.wrapWith() wraps export "useCategory" from "RootComponents/Category/useCategory.js"
          talons.RootComponents.Category.useCategoryContent.wrapWith() wraps export "useCategoryContent" from "RootComponents/Category/useCategoryContent.js"
          talons.RootComponents.Category.useNoProductsFound.wrapWith() wraps export "useNoProductsFound" from "RootComponents/Category/useNoProductsFound.js"
          talons.RootComponents.Product.useProduct.wrapWith() wraps export "useProduct" from "RootComponents/Product/useProduct.js"
          talons.SavedPaymentsPage.useCreditCard.wrapWith() wraps export "useCreditCard" from "SavedPaymentsPage/useCreditCard.js"
          talons.SavedPaymentsPage.useSavedPaymentsPage.wrapWith() wraps export "useSavedPaymentsPage" from "SavedPaymentsPage/useSavedPaymentsPage.js"
          talons.SearchBar.useAutocomplete.wrapWith() wraps export "useAutocomplete" from "SearchBar/useAutocomplete.js"
          talons.SearchBar.useSearchBar.wrapWith() wraps export "useSearchBar" from "SearchBar/useSearchBar.js"
          talons.SearchBar.useSearchField.wrapWith() wraps export "useSearchField" from "SearchBar/useSearchField.js"
          talons.SearchBar.useSuggestedCategory.wrapWith() wraps export "useSuggestedCategory" from "SearchBar/useSuggestedCategory.js"
          talons.SearchBar.useSuggestions.wrapWith() wraps export "useSuggestions" from "SearchBar/useSuggestions.js"
          talons.SearchPage.useSearchPage.wrapWith() wraps export "useSearchPage" from "SearchPage/useSearchPage.js"
          talons.SignIn.useSignIn.wrapWith() wraps export "useSignIn" from "SignIn/useSignIn.js"
          talons.SignInPage.useSignInPage.wrapWith() wraps export "useSignInPage" from "SignInPage/useSignInPage.js"
          talons.StockStatusMessage.useStockStatusMessage.wrapWith() wraps export "useStockStatusMessage" from "StockStatusMessage/useStockStatusMessage.js"
          talons.Wishlist.AddToListButton.helpers.useSingleWishlist.wrapWith() wraps export "useSingleWishlist" from "Wishlist/AddToListButton/helpers/useSingleWishlist.js"
          talons.Wishlist.AddToListButton.useAddToListButton.ce.wrapWith() wraps export "useAddToListButton.ce" from "Wishlist/AddToListButton/useAddToListButton.ce.js"
          talons.Wishlist.AddToListButton.useAddToListButton.ee.wrapWith() wraps export "useAddToListButton.ee" from "Wishlist/AddToListButton/useAddToListButton.ee.js"
          talons.Wishlist.WishlistDialog.CreateWishlistForm.useCreateWishlistForm.wrapWith() wraps export "useCreateWishlistForm" from "Wishlist/WishlistDialog/CreateWishlistForm/useCreateWishlistForm.js"
          talons.Wishlist.WishlistDialog.useWishlistDialog.wrapWith() wraps export "useWishlistDialog" from "Wishlist/WishlistDialog/useWishlistDialog.js"
          talons.WishlistPage.useActionMenu.wrapWith() wraps export "useActionMenu" from "WishlistPage/useActionMenu.js"
          talons.WishlistPage.useCreateWishlist.wrapWith() wraps export "useCreateWishlist" from "WishlistPage/useCreateWishlist.js"
          talons.WishlistPage.useWishlist.wrapWith() wraps export "useWishlist" from "WishlistPage/useWishlist.js"
          talons.WishlistPage.useWishlistItem.wrapWith() wraps export "useWishlistItem" from "WishlistPage/useWishlistItem.js"
          talons.WishlistPage.useWishlistItems.wrapWith() wraps export "useWishlistItems" from "WishlistPage/useWishlistItems.js"
          talons.WishlistPage.useWishlistPage.wrapWith() wraps export "useWishlistPage" from "WishlistPage/useWishlistPage.js"
    `);
});

test('enables third parties to wrap talons', async () => {
    // sorry, buildModuleWith is slow. TODO: make it take less than a minute?
    jest.setTimeout(60000);
    const talonIntegratingDep = {
        name: 'goose-app',
        declare() {},
        intercept(targets) {
            targets.of('@magento/peregrine').talons.tap(talons => {
                talons.ProductFullDetail.useProductFullDetail.wrapWith(
                    'src/usePFDIntercept'
                );
                talons.App.useApp.wrapWith('src/useAppIntercept');
                talons.App.useApp.wrapWith('src/swedish');
            });
        }
    };
    const built = await buildModuleWith('src/index.js', {
        context: __dirname,
        dependencies: [
            {
                name: '@magento/peregrine',
                declare,
                intercept
            },
            talonIntegratingDep
        ],
        mockFiles: {
            'src/index.js': `
 import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
 import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
 export default useApp() + useProductFullDetail()`,
            'src/usePFDIntercept': `export default function usePFDIntercept(original) { return function usePFD() { return 'BEEP >o'; } };`,
            'src/useAppIntercept': `export default function useAppIntercept(original) {
     return function useApp() {
         return 'o< HONK';
     };
 }
 `,
            'src/swedish': `export default function swedish(impl) {
    return function() {
        return impl().replace("O", "Ö")
    }
}`
        }
    });

    expect(built.run()).toBe('o< HÖNKBEEP >o');
});
