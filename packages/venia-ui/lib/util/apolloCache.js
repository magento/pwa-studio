import { defaultDataIdFromObject } from 'apollo-cache-inmemory';

/**
 * A non-exhaustive list of Magento Types defined by the GraphQL schema.
 */
const MagentoGraphQLTypes = {
    AddConfigurableProductsToCartOutput: 'AddConfigurableProductsToCartOutput',
    AddSimpleProductsToCartOutput: 'AddSimpleProductsToCartOutput',
    AddVirtualProductsToCartOutput: 'AddVirtualProductsToCartOutput',
    AppliedCoupon: 'AppliedCoupon',
    ApplyCouponToCartOutput: 'ApplyCouponToCartOutput',
    Attribute: 'Attribute',
    AttributeOption: 'AttributeOption',
    AvailablePaymentMethod: 'AvailablePaymentMethod',
    AvailableShippingMethod: 'AvailableShippingMethod',
    BillingCartAddress: 'BillingCartAddress',
    Breadcrumb: 'Breadcrumb',
    BundleItem: 'BundleItem',
    BundleItemOption: 'BundleItemOption',
    BundleProduct: 'BundleProduct',
    Cart: 'Cart',
    CartAddressCountry: 'CartAddressCountry',
    CartAddressInterface: 'CartAddressInterface',
    CartAddressRegion: 'CartAddressRegion',
    CartItemInterface: 'CartItemInterface',
    CartItemQuantity: 'CartItemQuantity',
    CartItemSelectedOptionValuePrice: 'CartItemSelectedOptionValuePrice',
    CartPrices: 'CartPrices',
    CartTaxItem: 'CartTaxItem',
    CategoryInterface: 'CategoryInterface',
    CategoryProducts: 'CategoryProducts',
    CategoryTree: 'CategoryTree',
    CmsBlock: 'CmsBlock',
    CmsBlocks: 'CmsBlocks',
    CmsPage: 'CmsPage',
    ComplexTextValue: 'ComplexTextValue',
    ConfigurableAttributeOption: 'ConfigurableAttributeOption',
    ConfigurableCartItem: 'ConfigurableCartItem',
    ConfigurableProduct: 'ConfigurableProduct',
    ConfigurableProductOptions: 'ConfigurableProductOptions',
    ConfigurableProductOptionsValues: 'ConfigurableProductOptionsValues',
    ConfigurableVariant: 'ConfigurableVariant',
    Country: 'Country',
    CountryCodeEnum: 'CountryCodeEnum',
    Currency: 'Currency',
    CurrencyEnum: 'CurrencyEnum',
    CustomAttributeMetadata: 'CustomAttributeMetadata',
    Customer: 'Customer',
    CustomerAddress: 'CustomerAddress',
    CustomerAddressAttribute: 'CustomerAddressAttribute',
    CustomerAddressRegion: 'CustomerAddressRegion',
    CustomerDownloadableProduct: 'CustomerDownloadableProduct',
    CustomerDownloadableProducts: 'CustomerDownloadableProducts',
    CustomerOrder: 'CustomerOrder',
    CustomerOrders: 'CustomerOrders',
    CustomerOutput: 'CustomerOutput',
    CustomerPaymentTokens: 'CustomerPaymentTokens',
    CustomerToken: 'CustomerToken',
    CustomizableAreaOption: 'CustomizableAreaOption',
    CustomizableAreaValue: 'CustomizableAreaValue',
    CustomizableCheckboxOption: 'CustomizableCheckboxOption',
    CustomizableCheckboxValue: 'CustomizableCheckboxValue',
    CustomizableDateOption: 'CustomizableDateOption',
    CustomizableDateValue: 'CustomizableDateValue',
    CustomizableDropDownOption: 'CustomizableDropDownOption',
    CustomizableDropDownValue: 'CustomizableDropDownValue',
    CustomizableFieldOption: 'CustomizableFieldOption',
    CustomizableFieldValue: 'CustomizableFieldValue',
    CustomizableFileOption: 'CustomizableFileOption',
    CustomizableFileValue: 'CustomizableFileValue',
    CustomizableMultipleOption: 'CustomizableMultipleOption',
    CustomizableMultipleValue: 'CustomizableMultipleValue',
    CustomizableOptionInterface: 'CustomizableOptionInterface',
    CustomizableProductInterface: 'CustomizableProductInterface',
    CustomizableRadioOption: 'CustomizableRadioOption',
    CustomizableRadioValue: 'CustomizableRadioValue',
    DeletePaymentTokenOutput: 'DeletePaymentTokenOutput',
    DownloadableFileTypeEnum: 'DownloadableFileTypeEnum',
    DownloadableProduct: 'DownloadableProduct',
    DownloadableProductLinks: 'DownloadableProductLinks',
    DownloadableProductSamples: 'DownloadableProductSamples',
    EntityUrl: 'EntityUrl',
    ExchangeRate: 'ExchangeRate',
    GiftCardAmounts: 'GiftCardAmounts',
    GiftCardProduct: 'GiftCardProduct',
    GiftCardTypeEnum: 'GiftCardTypeEnum',
    GroupedProduct: 'GroupedProduct',
    GroupedProductItem: 'GroupedProductItem',
    HttpQueryParameter: 'HttpQueryParameter',
    IsEmailAvailableOutput: 'IsEmailAvailableOutput',
    LayerFilter: 'LayerFilter',
    LayerFilterItem: 'LayerFilterItem',
    LayerFilterItemInterface: 'LayerFilterItemInterface',
    MediaGalleryEntry: 'MediaGalleryEntry',
    Money: 'Money',
    Order: 'Order',
    PaymentToken: 'PaymentToken',
    PaymentTokenTypeEnum: 'PaymentTokenTypeEnum',
    PhysicalProductInterface: 'PhysicalProductInterface',
    PlaceOrderOutput: 'PlaceOrderOutput',
    Price: 'Price',
    PriceAdjustment: 'PriceAdjustment',
    PriceAdjustmentCodesEnum: 'PriceAdjustmentCodesEnum',
    PriceAdjustmentDescriptionEnum: 'PriceAdjustmentDescriptionEnum',
    PriceTypeEnum: 'PriceTypeEnum',
    PriceViewEnum: 'PriceViewEnum',
    ProductImage: 'ProductImage',
    ProductInterface: 'ProductInterface',
    ProductLinks: 'ProductLinks',
    ProductLinksInterface: 'ProductLinksInterface',
    ProductMediaGalleryEntriesContent: 'ProductMediaGalleryEntriesContent',
    ProductMediaGalleryEntriesVideoContent:
        'ProductMediaGalleryEntriesVideoContent',
    ProductPrices: 'ProductPrices',
    ProductStockStatus: 'ProductStockStatus',
    ProductTierPrices: 'ProductTierPrices',
    Products: 'Products',
    Region: 'Region',
    RemoveCouponFromCartOutput: 'RemoveCouponFromCartOutput',
    RemoveItemFromCartOutput: 'RemoveItemFromCartOutput',
    RevokeCustomerTokenOutput: 'RevokeCustomerTokenOutput',
    SearchResultPageInfo: 'SearchResultPageInfo',
    SelectedConfigurableOption: 'SelectedConfigurableOption',
    SelectedCustomizableOption: 'SelectedCustomizableOption',
    SelectedCustomizableOptionValue: 'SelectedCustomizableOptionValue',
    SelectedPaymentMethod: 'SelectedPaymentMethod',
    SelectedShippingMethod: 'SelectedShippingMethod',
    SendEmailToFriendOutput: 'SendEmailToFriendOutput',
    SendEmailToFriendRecipient: 'SendEmailToFriendRecipient',
    SendEmailToFriendSender: 'SendEmailToFriendSender',
    SetBillingAddressOnCartOutput: 'SetBillingAddressOnCartOutput',
    SetGuestEmailOnCartOutput: 'SetGuestEmailOnCartOutput',
    SetPaymentMethodOnCartOutput: 'SetPaymentMethodOnCartOutput',
    SetShippingAddressesOnCartOutput: 'SetShippingAddressesOnCartOutput',
    SetShippingMethodsOnCartOutput: 'SetShippingMethodsOnCartOutput',
    ShipBundleItemsEnum: 'ShipBundleItemsEnum',
    ShippingCartAddress: 'ShippingCartAddress',
    SimpleCartItem: 'SimpleCartItem',
    SimpleProduct: 'SimpleProduct',
    SortEnum: 'SortEnum',
    SortField: 'SortField',
    SortFields: 'SortFields',
    StoreConfig: 'StoreConfig',
    SwatchData: 'SwatchData',
    SwatchLayerFilterItem: 'SwatchLayerFilterItem',
    SwatchLayerFilterItemInterface: 'SwatchLayerFilterItemInterface',
    UpdateCartItemsOutput: 'UpdateCartItemsOutput',
    UrlRewrite: 'UrlRewrite',
    UrlRewriteEntityTypeEnum: 'UrlRewriteEntityTypeEnum',
    VirtualCartItem: 'VirtualCartItem',
    VirtualProduct: 'VirtualProduct',
    Website: 'Website',
    WishlistItem: 'WishlistItem',
    WishlistOutput: 'WishlistOutput'
};

/**
 * The default way the Apollo InMemoryCache stores objects is by using a key
 * that is a concatenation of the `__typename` and `id` (or `_id`) fields.
 * For example, "ConfigurableProduct:1098".
 *
 * Unfortunately, not all Magento 2 GraphQL Types have an `id` (or `_id`) field.
 * This function "normalizes" those Type objects by generating a custom unique key for them
 * that will be used by the Apollo cache.
 *
 * @see https://www.apollographql.com/docs/resources/graphql-glossary/#normalization.
 *
 * @param {object} A GraphQL Type object.
 */
export const cacheKeyFromType = object => {
    switch (object.__typename) {
        // Store all implementations of ProductInterface with the same prefix,
        // and because we can't filter / query by id, use their url_key.
        case MagentoGraphQLTypes.BundleProduct:
        case MagentoGraphQLTypes.ConfigurableProduct:
        case MagentoGraphQLTypes.DownloadableProduct:
        case MagentoGraphQLTypes.GiftCardProduct:
        case MagentoGraphQLTypes.GroupedProduct:
        case MagentoGraphQLTypes.SimpleProduct:
        case MagentoGraphQLTypes.VirtualProduct:
            return `${MagentoGraphQLTypes.ProductInterface}:${object.url_key}`;

        // Fallback to default handling.
        default:
            return defaultDataIdFromObject(object);
    }
};
