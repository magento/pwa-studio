/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useEffect, useState, useMemo } from 'react';
import './product-list.css';

import { Alert } from '../../components/Alert';
import { useProducts, useStore } from '../../context';
import { ProductItem } from '../ProductItem';
import { classNames } from '../../utils/dom';
import { sanitizeProducts } from '../../utils/modifyResults';
import { useResultsModifier } from '../../context/resultsModifierContext';


const ProductList = ({ products, numberOfColumns, showFilters }) => {
  const productsCtx = useProducts();
  const {
    currencySymbol,
    currencyRate,
    setRoute,
    refineProduct,
    refreshCart,
    addToCart,
  } = productsCtx;

  const [cartUpdated, setCartUpdated] = useState(false);
  const [itemAdded, setItemAdded] = useState('');
  const { viewType } = useProducts();
  const [error, setError] = useState(false);

  const {
    config: { listview },
  } = useStore();

  // const cleanUrl = (url, cleanWithProtocol = false) => {
  //   if (!url) return url;
  //   try {
  //     if (cleanWithProtocol) return url.replace('http://local.magentocomposeree.com:8082', '');
  //     return url.replace('//local.magentocomposeree.com:8082', '');
  //   } catch {
  //     return url;
  //   }
  // };

  const { baseUrl, baseUrlWithoutProtocol } = useResultsModifier();
  //console.log("PROductList baseURL = ",baseUrl);
  //console.log("PROductList baseUrlWithoutProtocol = ",baseUrlWithoutProtocol);

  const sanitizedProducts = useMemo(() => sanitizeProducts(products, baseUrl, baseUrlWithoutProtocol), [products]);  
//   const sanitizedProducts = useMemo(() => {
//   if (!products || products.length === 0) return [];

//   return products.map(item => {
//     const prod = item.product;
//     const prodView = item.productView;

//     if (!prod) return item;

//     const sanitizeImage = (img, cleanWithProtocol = false) => {
//       if (Array.isArray(img)) {
//         return img.map(i =>
//           i && i.url ? { ...i, url: cleanUrl(i.url, cleanWithProtocol) } : i
//         );
//       }

//       return img && img.url ? { ...img, url: cleanUrl(img.url, cleanWithProtocol) } : img;
//     };

//     return {
//       ...item,
//       product: {
//         ...prod,
//         canonical_url: cleanUrl(prod.canonical_url),
//         image: sanitizeImage(prod.image),
//         small_image: sanitizeImage(prod.small_image),
//         thumbnail: sanitizeImage(prod.thumbnail)
//       },
//       productView: {
//         ...prodView,
//         images: sanitizeImage(prodView?.images, true),
//         url: cleanUrl(prodView?.url, true)
//       }
//     };
//   });
// }, [products]);

  // console.log("sanitizedProducts = ",sanitizedProducts);
  // console.log("products = ",JSON.stringify(products));
  // console.log("ProductList.jsx refineProduct = ",refineProduct);

  const className = showFilters
    ? 'ds-sdk-product-list bg-body max-w-full pl-3 pb-2xl sm:pb-24'
    : 'ds-sdk-product-list bg-body w-full mx-auto pb-2xl sm:pb-24';

  useEffect(() => {
    if (refreshCart) refreshCart();
  }, [itemAdded]);

  return (
    <div
      className={classNames(
        'ds-sdk-product-list bg-body pb-2xl sm:pb-24',
        className
      )}
    >
      {cartUpdated && (
        <div className="mt-8">
          <Alert
            title={`You added ${itemAdded} to your shopping cart.`}
            type="success"
            description=""
            onClick={() => setCartUpdated(false)}
          />
        </div>
      )}
      {error && (
        <div className="mt-8">
          <Alert
            title="Something went wrong trying to add an item to your cart."
            type="error"
            description=""
            onClick={() => setError(false)}
          />
        </div>
      )}

      {listview && viewType === 'listview' ? (
        <div className="w-full">
          <div className="ds-sdk-product-list__list-view-default mt-md grid grid-cols-none pt-[15px] w-full gap-[10px]">
            {sanitizedProducts?.map((product) => (
              //console.log("listview = ", product)
              <ProductItem
                key={product?.productView?.id}
                item={product}
                currencySymbol={currencySymbol}
                currencyRate={currencyRate}
                setRoute={setRoute}
                refineProduct={refineProduct}
                setCartUpdated={setCartUpdated}
                setItemAdded={setItemAdded}
                addToCart={addToCart}
                setError={setError}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
          }}
          className="ds-sdk-product-list__grid mt-md grid gap-y-8 gap-x-2xl xl:gap-x-8"
        >
          {sanitizedProducts?.map((product) => (
            //console.log("non list view = ", product)
            <ProductItem
              key={product?.productView?.id}
              item={product}
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
              setRoute={setRoute}
              refineProduct={refineProduct}
              setCartUpdated={setCartUpdated}
              setItemAdded={setItemAdded}
              addToCart={addToCart}
              setError={setError}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
