/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React, { useState } from 'react';
import '../ProductItem/ProductItem.css';

import { useCart, useProducts, useSensor, useStore } from '../../context';
import NoImage from '../../icons/NoImage.svg';
import {
  generateOptimizedImages,
  getProductImageURLs,
} from '../../utils/getProductImage';
import { htmlStringDecode } from '../../utils/htmlStringDecode';
import AddToCartButton from '../AddToCartButton';
import { ImageCarousel } from '../ImageCarousel';
import { SwatchButtonGroup } from '../SwatchButtonGroup';
import ProductPrice from './ProductPrice';
import { SEARCH_UNIT_ID } from '../../utils/constants';
import { sanitizeRefinedImages } from '../../utils/modifyResults';
import { useResultsModifier } from '../../context/resultsModifierContext';

const ProductItem = ({
  item,
  currencySymbol,
  currencyRate,
  setRoute,
  refineProduct,
  setCartUpdated,
  setItemAdded,
  setError,
  addToCart,
}) => {
  const { product, productView } = item;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedSwatch, setSelectedSwatch] = useState('');
  const [imagesFromRefinedProduct, setImagesFromRefinedProduct] = useState(null);
  const [refinedProduct, setRefinedProduct] = useState();
  const [isHovering, setIsHovering] = useState(false);
  const { addToCartGraphQL, refreshCart } = useCart();
  const { viewType } = useProducts();
  const {
    config: { optimizeImages, imageBaseWidth, imageCarousel, listview },
  } = useStore();

  const { screenSize } = useSensor();

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  //function to sanitize images , TODO: move to utils later
  // const cleanUrl = (url, cleanWithProtocol = false) => {
  //   if (!url) return url;
  //   try {
  //     if (cleanWithProtocol) return url.replace('http://local.magentocomposeree.com:8082', '');
  //     return url.replace('//local.magentocomposeree.com:8082', '');
  //   } catch {
  //     return url;
  //   }
  // };
  //function to sanitize images , TODO: move to utils later 
  // const sanitizeRefinedImages = (img, cleanWithProtocol = false) => {
  //     if (Array.isArray(img)) {
  //       return img.map(i =>
  //         i && i.url ? { ...i, url: cleanUrl(i.url, cleanWithProtocol) } : i
  //       );
  //     }
  // }

  const { baseUrl, baseUrlWithoutProtocol } = useResultsModifier();

  const handleSelection = async (optionIds, sku) => {
    const data = await refineProduct(optionIds, sku);
    setSelectedSwatch(optionIds[0]);
    //console.log("ProductItem.jsx data.refineProduct.images = ", data.refineProduct.images);
    //original
    //setImagesFromRefinedProduct(data.refineProduct.images,true);
    //workaround
    setImagesFromRefinedProduct(sanitizeRefinedImages(data.refineProduct.images, baseUrl, baseUrlWithoutProtocol));
    setRefinedProduct(data);
    setCarouselIndex(0);
  };

  const isSelected = (id) => {
    const selected = selectedSwatch ? selectedSwatch === id : false;
    return selected;
  };

  //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
  // const productImageArray = imagesFromRefinedProduct
  //   ? getProductImageURLs(imagesFromRefinedProduct ?? [], imageCarousel ? 3 : 1)
  //   : getProductImageURLs(
  //       productView.images ?? [],
  //       imageCarousel ? 3 : 1, // number of images to display in carousel
  //       product.image?.url ?? undefined
  //     );

  //work around
  const productImageArray = imagesFromRefinedProduct
    ? getProductImageURLs(imagesFromRefinedProduct.length ? imagesFromRefinedProduct : [], imageCarousel ? 3 : 1)
    : getProductImageURLs(
        productView.images && productView.images.length ? productView.images : [],
        imageCarousel ? 3 : 1, // number of images to display in carousel
        product.image && product.image.url ? product.image.url : undefined
      );
    

  let optimizedImageArray = [];
  
  //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
  // if (optimizeImages) {
  //   optimizedImageArray = generateOptimizedImages(
  //     productImageArray,
  //     imageBaseWidth ?? 200
  //   );
  // }

  //work around
  if (optimizeImages) {
    optimizedImageArray = generateOptimizedImages(
      productImageArray,
      imageBaseWidth !== undefined && imageBaseWidth !== null ? imageBaseWidth : 200
    );
  }


  const discount = refinedProduct
    ? refinedProduct.refineProduct?.priceRange?.minimum?.regular?.amount
        ?.value >
      refinedProduct.refineProduct?.priceRange?.minimum?.final?.amount?.value
    : product?.price_range?.minimum_price?.regular_price?.value >
        product?.price_range?.minimum_price?.final_price?.value ||
      productView?.price?.regular?.amount?.value >
        productView?.price?.final?.amount?.value;

  const isSimple = product?.__typename === 'SimpleProduct';
  const isComplexProductView = productView?.__typename === 'ComplexProductView';
  const isBundle = product?.__typename === 'BundleProduct';
  const isGrouped = product?.__typename === 'GroupedProduct';
  const isGiftCard = product?.__typename === 'GiftCardProduct';
  const isConfigurable = product?.__typename === 'ConfigurableProduct';

  const onProductClick = () => {
    window.magentoStorefrontEvents?.publish.searchProductClick(
      SEARCH_UNIT_ID,
      product?.sku
    );
  };

  const productUrl = setRoute
    ? setRoute({ sku: productView?.sku, urlKey: productView?.urlKey })
    : product?.canonical_url;

  const handleAddToCart = async () => {
    setError(false);
    if (isSimple) {
      if (addToCart) {
        await addToCart(productView.sku, [], 1);
      } else {
        const response = await addToCartGraphQL(productView.sku);

        if (
          response?.errors ||
          response?.data?.addProductsToCart?.user_errors.length > 0
        ) {
          setError(true);
          return;
        }

        setItemAdded(product.name);
        refreshCart && refreshCart();
        setCartUpdated(true);
      }
    } else if (productUrl) {
      window.open(productUrl, '_self');
    }
  };

  if (listview && viewType === 'listview') {
    return (
      <>
        <div className="grid-container">
          <div
            className={`product-image ds-sdk-product-item__image relative rounded-md overflow-hidden}`}
          >
            <a
              href={productUrl}
              onClick={onProductClick}
              className="!text-primary hover:no-underline hover:text-primary"
            >
              {/* Image */}
              {productImageArray.length ? (
                <ImageCarousel
                  images={
                    optimizedImageArray.length
                      ? optimizedImageArray
                      : productImageArray
                  }
                  productName={product.name}
                  carouselIndex={carouselIndex}
                  setCarouselIndex={setCarouselIndex}
                />
              ) : (
                <img src={NoImage} className={`max-h-[250px] max-w-[200px] pr-5 m-auto object-cover object-center lg:w-full`} />
                // <NoImage
                //   className={`max-h-[250px] max-w-[200px] pr-5 m-auto object-cover object-center lg:w-full`}
                // />
              )}
            </a>
          </div>
          <div className="product-details">
            <div className="flex flex-col w-1/3">
              {/* Product name */}
              <a
                href={productUrl}
                onClick={onProductClick}
                className="!text-primary hover:no-underline hover:text-primary"
              >
                <div className="ds-sdk-product-item__product-name mt-xs text-sm text-primary">
                  {product.name !== null && htmlStringDecode(product.name)}
                </div>
                <div className="ds-sdk-product-item__product-sku mt-xs text-sm text-primary">
                  SKU:
                  {product.sku !== null && htmlStringDecode(product.sku)}
                </div>
              </a>

              {/* Swatch */}
              <div className="ds-sdk-product-item__product-swatch flex flex-row mt-sm text-sm text-primary pb-6">
                {productView?.options?.map(
                  (swatches) =>
                    swatches.id === 'color' && (
                      <SwatchButtonGroup
                        key={`${productView?.sku}-${option.id}`}
                        isSelected={isSelected}
                        //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
                        // swatches={swatches.values ?? []}
                        //work around
                        swatches={swatches.values && swatches.values.length ? swatches.values : []}
                        showMore={onProductClick}
                        productUrl={productUrl}
                        onClick={handleSelection}
                        sku={productView?.sku}
                      />
                    )
                )}
              </div>
            </div>
          </div>
          <div className="product-price">
            <a
              href={productUrl}
              onClick={onProductClick}
              className="!text-primary hover:no-underline hover:text-primary"
            >
              <ProductPrice
                //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
                // item={refinedProduct ?? item}
                //workaround
                item={refinedProduct !== undefined && refinedProduct !== null ? refinedProduct : item}
                isBundle={isBundle}
                isGrouped={isGrouped}
                isGiftCard={isGiftCard}
                isConfigurable={isConfigurable}
                isComplexProductView={isComplexProductView}
                discount={discount}
                currencySymbol={currencySymbol}
                currencyRate={currencyRate}
              />
            </a>
          </div>
          <div className="product-description text-sm text-primary mt-xs">
            <a
              href={productUrl}
              onClick={onProductClick}
              className="!text-primary hover:no-underline hover:text-primary"
            >
              {product.short_description?.html ? (
                <>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: product.short_description.html,
                    }}
                  />
                </>
              ) : (
                <span />
              )}
            </a>
          </div>

          <div className="product-ratings" />
          <div className="product-add-to-cart">
            <div className="pb-4 h-[38px] w-96">
              <AddToCartButton onClick={handleAddToCart} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="ds-sdk-product-item group relative flex flex-col max-w-sm justify-between h-full hover:border-[1.5px] border-solid hover:shadow-lg border-offset-2 p-5"
      style={{
        'borderColor': '#D5D5D5',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      <a
        href={productUrl}
        onClick={onProductClick}
        className="!text-primary hover:no-underline hover:text-primary"
      >
        <div className="ds-sdk-product-item__main relative flex flex-col justify-between h-full">
          <div className="ds-sdk-product-item__image relative w-full h-full rounded-md overflow-hidden">
            {productImageArray.length ? (
              <ImageCarousel
                images={
                  optimizedImageArray.length
                    ? optimizedImageArray
                    : productImageArray
                }
                productName={product.name}
                carouselIndex={carouselIndex}
                setCarouselIndex={setCarouselIndex}
              />
            ) : (
              <img src={NoImage} className={`max-h-[45rem] w-full object-cover object-center lg:w-full`} />
              // <NoImage
              //   className={`max-h-[45rem] w-full object-cover object-center lg:w-full`}
              // />
            )}
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="ds-sdk-product-item__product-name mt-md text-sm text-primary">
                {product.name !== null && htmlStringDecode(product.name)}
              </div>
              <ProductPrice
                //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
                //item={refinedProduct ?? item}
                //workaround
                item={refinedProduct !== undefined && refinedProduct !== null ? refinedProduct : item}
                isBundle={isBundle}
                isGrouped={isGrouped}
                isGiftCard={isGiftCard}
                isConfigurable={isConfigurable}
                isComplexProductView={isComplexProductView}
                discount={discount}
                currencySymbol={currencySymbol}
                currencyRate={currencyRate}
              />
            </div>
          </div>
        </div>
      </a>

      {productView?.options && productView.options?.length > 0 && (
        <div className="ds-sdk-product-item__product-swatch mt-sm text-sm text-primary pb-6">
          {productView?.options.map((option) => (
            <SwatchButtonGroup
              key={`${productView?.sku}-${option.id}`}
              isSelected={isSelected}
              //getting error because the nullish coalescing operator (??) isn't supported by your Babel/Webpack setup yet.
              //swatches={option.values ?? []}
              //workaround
              swatches={option.values && option.values.length ? option.values : []}
              showMore={onProductClick}
              productUrl={productUrl}
              onClick={handleSelection}
              sku={productView?.sku}
            />
          ))}
        </div>
      )}

      <div className="ds-sdk-product-item__add-to-cart py-2">
        <AddToCartButton onClick={handleAddToCart} />
      </div>
    </div>
  );
};

export default ProductItem;
