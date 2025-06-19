// Copyright 2024 Adobe
// All Rights Reserved.
//
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.

// Clean a URL based on provided baseUrl(s)
export const cleanUrl = (url, cleanWithProtocol = false, baseUrl = '', baseUrlWithoutProtocol = '') => {
  if (!url) return url;

  try {
    if (cleanWithProtocol) {
      return baseUrl ? url.replace(baseUrl, '') : url;
    }
    return baseUrlWithoutProtocol ? url.replace(baseUrlWithoutProtocol, '') : url;
  } catch {
    return url;
  }
};

export const cleanSwatchUrl = (url, cleanWithProtocol = true, baseUrl = '', baseUrlWithoutProtocol = '') => {
  if (!url) return url;

  try {
    if (cleanWithProtocol) {
      if (baseUrl.endsWith('/')) {
        const sanitizeBaseUrl = baseUrl.replace(/\/$/, '');
        return sanitizeBaseUrl ? url.replace(sanitizeBaseUrl, '') : url;
      }
      return baseUrl ? url.replace(baseUrl, '') : url;
    }
    return baseUrlWithoutProtocol ? url.replace(baseUrlWithoutProtocol, '') : url;
  } catch {
    return url;
  }
};

export const sanitizeImage = (img, cleanWithProtocol = false, baseUrl, baseUrlWithoutProtocol) => {
  if (Array.isArray(img)) {
    return img.map(i =>
      i && i.url ? { ...i, url: cleanUrl(i.url, cleanWithProtocol, baseUrl, baseUrlWithoutProtocol) } : i
    );
  }
  return img && img.url
    ? { ...img, url: cleanUrl(img.url, cleanWithProtocol, baseUrl, baseUrlWithoutProtocol) }
    : img;
};

export const sanitizeRefinedImages = (refinedImages, baseUrl, baseUrlWithoutProtocol, areSwatchImages = false) => {

  if (!refinedImages || !Array.isArray(refinedImages)) return refinedImages;

  return refinedImages.map(img => {
    if (!img || !img.url) return img;

    const cleanImageUrl = areSwatchImages ? cleanSwatchUrl(img.url, true, baseUrl, baseUrlWithoutProtocol) : cleanUrl(img.url, false, baseUrl, baseUrlWithoutProtocol);

    return {
      ...img,
      url: cleanImageUrl
    };
  });
};

export const sanitizeProducts = (products, baseUrl, baseUrlWithoutProtocol) => {
  if (!products || products.length === 0) return [];

  return products.map(item => {
    const prod = item.product;
    const prodView = item.productView;

    if (!prod) return item;

    return {
      ...item,
      product: {
        ...prod,
        canonical_url: cleanUrl(prod.canonical_url, false, baseUrl, baseUrlWithoutProtocol),
        image: sanitizeImage(prod.image, false, baseUrl, baseUrlWithoutProtocol),
        small_image: sanitizeImage(prod.small_image, false, baseUrl, baseUrlWithoutProtocol),
        thumbnail: sanitizeImage(prod.thumbnail, false, baseUrl, baseUrlWithoutProtocol)
      },
      productView: {
        ...prodView,
        images: sanitizeImage(prodView?.images, true, baseUrl, baseUrlWithoutProtocol),
        url: cleanUrl(prodView?.url, true, baseUrl, baseUrlWithoutProtocol)
      }
    };
  });
};

