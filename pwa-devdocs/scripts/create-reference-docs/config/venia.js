module.exports = [
    {
        target: 'venia-ui/lib/components/Shimmer/shimmer.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/Link/link.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/RichContent/richContent.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/ToastContainer/toastContainer.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/Button/button.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/ButtonGroup/buttonGroup.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/Logo/logo.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/Mask/mask.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/Portal/portal.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/ProductImageCarousel/carousel.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/Trigger/trigger.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/targets/venia-ui-declare.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/targets/RichContentRendererList.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/CartPage/cartPage.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/CartPage/GiftCards/giftCards.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.js',
        type: 'function',
        childComponents: [
            'venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.js',
            'venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions/giftOptions.js',
            'venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingMethods.js',
        ]
    },
    {
        target: 'venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js',
        type: 'function'
    },
    {
        target: 'venia-ui/lib/components/CartPage/ProductListing/productListing.js',
        type: 'function',
        childComponents: [
            'venia-ui/lib/components/CartPage/ProductListing/EditModal/editModal.js',
        ]
    }
];
