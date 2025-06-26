// Copyright 2024 Adobe
// All Rights Reserved.
//
// NOTICE: Adobe permits you to use, modify, and distribute this file in
// accordance with the terms of the Adobe license agreement accompanying
// it.

const getProductImageURLs = (images, amount = 3, topImageUrl) => {
    const imageUrlArray = [];
    const url = new URL(window.location.href);
    //original protocol
    const protocol = url.protocol;

    //making protocol empty
    //const protocol = '';
    // const topImageUrl = "http://master-7rqtwti-wdxwuaerh4gbm.eu-4.magentosite.cloud/media/catalog/product/3/1/31t0a-sopll._ac_.jpg";
    for (const image of images) {
        const imageUrl = image.url?.replace(/^https?:\/\//, '');
        if (imageUrl) {
            //original
            //imageUrlArray.push(`${protocol}//${imageUrl}`);

            //to remove protocol
            imageUrlArray.push(`${imageUrl}`);
        }
    }

    if (topImageUrl) {
        //original
        // const topImageUrlFormatted = `${protocol}//${topImageUrl.replace(
        //     /^https?:\/\//,
        //     ''
        // )}`;

        //to remove protocol
        const topImageUrlFormatted = `${topImageUrl.replace(
            /^https?:\/\//,
            ''
        )}`;

        const index = topImageUrlFormatted.indexOf(topImageUrlFormatted);
        if (index > -1) {
            imageUrlArray.splice(index, 1);
        }

        imageUrlArray.unshift(topImageUrlFormatted);
    }

    return imageUrlArray.slice(0, amount);
};

const resolveImageUrl = (url, opts) => {
    const [base, query] = url.split('?');
    const params = new URLSearchParams(query);

    Object.entries(opts).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.set(key, String(value));
        }
    });

    return `${base}?${params.toString()}`;
};

const generateOptimizedImages = (imageUrls, baseImageWidth) => {
    const baseOptions = {
        fit: 'cover',
        crop: false,
        dpi: 1
    };

    const imageUrlArray = [];

    for (const imageUrl of imageUrls) {
        const src = resolveImageUrl(imageUrl, {
            ...baseOptions,
            width: baseImageWidth
        });
        const dpiSet = [1, 2, 3];
        const srcset = dpiSet.map(dpi => {
            return `${resolveImageUrl(imageUrl, {
                ...baseOptions,
                auto: 'webp',
                quality: 80,
                width: baseImageWidth * dpi
            })} ${dpi}x`;
        });
        imageUrlArray.push({ src, srcset });
    }

    return imageUrlArray;
};

export { generateOptimizedImages, getProductImageURLs };
