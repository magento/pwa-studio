/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useContext } from 'react';
import { TranslationContext } from '../../context/translation';
import { getProductPrice } from '../../utils/getProductPrice';

const ProductPrice = ({
  isComplexProductView,
  item,
  isBundle,
  isGrouped,
  isGiftCard,
  isConfigurable,
  discount,
  currencySymbol,
  currencyRate
}) => {
  const translation = useContext(TranslationContext);
  let price;

  if ('product' in item) {
    //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
    // price =
    //   item?.product?.price_range?.minimum_price?.final_price ??
    //   item?.product?.price_range?.minimum_price?.regular_price;

    //workaround
    price = 
      item && item.product && item.product.price_range && item.product.price_range.minimum_price && item.product.price_range.minimum_price.final_price 
      ? item.product.price_range.minimum_price.final_price : item && item.product && item.product.price_range && item.product.price_range.minimum_price && item.product.price_range.minimum_price.regular_price 
       ? item.product.price_range.minimum_price.regular_price : undefined;
  } else {

    //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
    // price =
    //   item?.refineProduct?.priceRange?.minimum?.final ??
    //   item?.refineProduct?.price?.final;

    //workaround
    price = 
      item && item.refineProduct && item.refineProduct.priceRange && item.refineProduct.priceRange.minimum && item.refineProduct.priceRange.minimum.final 
      ? item.refineProduct.priceRange.minimum.final 
      : item && item.refineProduct && item.refineProduct.price && item.refineProduct.price.final 
        ? item.refineProduct.price.final : undefined;
  }

  const getBundledPrice = (item, currencySymbol, currencyRate) => {
    const bundlePriceTranslationOrder =
      translation.ProductCard.bundlePrice.split(' ');
    return bundlePriceTranslationOrder.map((word, index) =>
      word === '{fromBundlePrice}' ? (
        `${getProductPrice(item, currencySymbol, currencyRate, false, true)} `
      ) : word === '{toBundlePrice}' ? (
        getProductPrice(item, currencySymbol, currencyRate, true, true)
      ) : (
        <span className="text-gray-500 text-xs font-normal mr-xs" key={index}>
          {word}
        </span>
      )
    );
  };

  const getPriceFormat = (item, currencySymbol, currencyRate, isGiftCard) => {
    const priceTranslation = isGiftCard
      ? translation.ProductCard.from
      : translation.ProductCard.startingAt;
    const startingAtTranslationOrder = priceTranslation.split('{productPrice}');
    return startingAtTranslationOrder.map((word, index) =>
      word === '' ? (
        getProductPrice(item, currencySymbol, currencyRate, false, true)
      ) : (
        <span className="text-gray-500 text-xs font-normal mr-xs" key={index}>
          {word}
        </span>
      )
    );
  };

  const getDiscountedPrice = (discount) => {
    const discountPrice = discount ? (
      <>
        <span className="line-through pr-2">
          {getProductPrice(item, currencySymbol, currencyRate, false, false)}
        </span>
        <span className="text-secondary">
          {getProductPrice(item, currencySymbol, currencyRate, false, true)}
        </span>
      </>
    ) : (
      getProductPrice(item, currencySymbol, currencyRate, false, true)
    );
    const discountedPriceTranslation = translation.ProductCard.asLowAs;
    const discountedPriceTranslationOrder =
      discountedPriceTranslation.split('{discountPrice}');
    return discountedPriceTranslationOrder.map((word, index) =>
      word === '' ? (
        discountPrice
      ) : (
        <span className="text-gray-500 text-xs font-normal mr-xs" key={index}>
          {word}
        </span>
      )
    );
  };

  return (
    <>
      {price && (
        <div className="ds-sdk-product-price">
          {!isBundle &&
            !isGrouped &&
            !isConfigurable &&
            !isComplexProductView &&
            discount && (
              <p className="ds-sdk-product-price--discount mt-xs text-sm font-medium text-gray-900 my-auto">
                <span className="line-through pr-2">
                  {getProductPrice(
                    item,
                    currencySymbol,
                    currencyRate,
                    false,
                    false
                  )}
                </span>
                <span className="text-secondary">
                  {getProductPrice(
                    item,
                    currencySymbol,
                    currencyRate,
                    false,
                    true
                  )}
                </span>
              </p>
            )}

          {!isBundle &&
            !isGrouped &&
            !isGiftCard &&
            !isConfigurable &&
            !isComplexProductView &&
            !discount && (
              <p className="ds-sdk-product-price--no-discount mt-xs text-sm font-medium text-gray-900 my-auto">
                {getProductPrice(
                  item,
                  currencySymbol,
                  currencyRate,
                  false,
                  true
                )}
              </p>
            )}

          {isBundle && (
            <div className="ds-sdk-product-price--bundle">
              <p className="mt-xs text-sm font-medium text-gray-900 my-auto">
                {getBundledPrice(item, currencySymbol, currencyRate)}
              </p>
            </div>
          )}

          {isGrouped && (
            <p className="ds-sdk-product-price--grouped mt-xs text-sm font-medium text-gray-900 my-auto">
              {getPriceFormat(item, currencySymbol, currencyRate, false)}
            </p>
          )}

          {isGiftCard && (
            <p className="ds-sdk-product-price--gift-card mt-xs text-sm font-medium text-gray-900 my-auto">
              {getPriceFormat(item, currencySymbol, currencyRate, true)}
            </p>
          )}

          {!isGrouped &&
            !isBundle &&
            (isConfigurable || isComplexProductView) && (
              <p className="ds-sdk-product-price--configurable mt-xs text-sm font-medium text-gray-900 my-auto">
                {getDiscountedPrice(discount)}
              </p>
            )}
        </div>
      )}
    </>
  );
};

export default ProductPrice;
