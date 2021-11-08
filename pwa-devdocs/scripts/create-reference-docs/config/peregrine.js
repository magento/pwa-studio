module.exports = [
    {
        target: 'peregrine/lib/Price/price.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/List/list.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/useEventListener.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/useDropdown.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/useWindowSize.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/useSearchParam.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/usePagination.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/Toasts/useToastContext.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/Toasts/useToasts.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/talons/CartPage/useCartPage.js',
        type: 'function',
    },
    {
        target: 'peregrine/lib/talons/CartPage/GiftCards/useGiftCards.js',
        type: 'function',
        childComponents: [
            'peregrine/lib/talons/CartPage/GiftCards/useGiftCard.js'
        ]
    },
    {
        target: 'peregrine/lib/talons/CartPage/PriceAdjustments/GiftOptions/useGiftOptions.js',
        type: 'function',
    },
    {
        target: 'peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/useCouponCode.js',
        type: 'function',
        childComponents: [
            'peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm.js',
            'peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods.js',
            'peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingRadios.js'
        ]
    },
    {
        target: 'peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary.js',
        type: 'function',
    },
    {
        target: 'peregrine/lib/talons/CartPage/ProductListing/useProductListing.js',
        type: 'function',
        childComponents: [
            'peregrine/lib/talons/CartPage/ProductListing/useProduct.js',
            'peregrine/lib/talons/CartPage/ProductListing/useQuantity.js',
            'peregrine/lib/talons/CartPage/ProductListing/EditModal/useEditModal.js',
            'peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm.js',
        ]
    },
    {
        target: 'peregrine/lib/targets/peregrine-declare.js',
        type: 'function'
    }
];
