// Copyright 2024 Adobe
// All Rights Reserved.
//
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.

import getSymbolFromCurrency from 'currency-symbol-map';

const getProductPrice = (
    product,
    currencySymbol,
    currencyRate,
    useMaximum = false,
    useFinal = false
) => {
    let priceType;
    let price;
    if ('product' in product) {
        priceType = product?.product?.price_range?.minimum_price;

        if (useMaximum) {
            priceType = product?.product?.price_range?.maximum_price;
        }

        price = priceType?.regular_price;
        if (useFinal) {
            price = priceType?.final_price;
        }
    } else {
        //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
        // priceType =
        //   product?.refineProduct?.priceRange?.minimum ??
        //   product?.refineProduct?.price;

        //workaround
        priceType =
            product &&
            product.refineProduct &&
            product.refineProduct.priceRange &&
            product.refineProduct.priceRange.minimum
                ? product.refineProduct.priceRange.minimum
                : product &&
                  product.refineProduct &&
                  product.refineProduct.price
                ? product.refineProduct.price
                : undefined;

        if (useMaximum) {
            priceType = product?.refineProduct?.priceRange?.maximum;
        }

        price = priceType?.regular?.amount;
        if (useFinal) {
            price = priceType?.final?.amount;
        }
    }

    // if currency symbol is configurable within Commerce, that symbol is used
    let currency = price?.currency;

    if (currencySymbol) {
        currency = currencySymbol;
    } else {
        //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
        //currency = getSymbolFromCurrency(currency) ?? '$';

        // work around
        currency =
            getSymbolFromCurrency(currency) !== undefined &&
            getSymbolFromCurrency(currency) !== null
                ? getSymbolFromCurrency(currency)
                : '$';
    }

    const convertedPrice = currencyRate
        ? price?.value * parseFloat(currencyRate)
        : price?.value;

    return convertedPrice ? `${currency}${convertedPrice.toFixed(2)}` : '';
};

export { getProductPrice };
