import React, { useRef } from 'react';
import { string, shape } from 'prop-types';

import useRecsTrackingProps from '../../hooks/useRecsTrackingProps';
import { Gallery } from '../Gallery/Gallery';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
// inline loading of the css is janky, but the webpack loader gets blown  out in local environment.
import defaultClasses from '!!style-loader!css-loader?modules!./ProductRecommendations.css';
import useObserver from '../../hooks/useObserver';
import { mse } from '@magento/venia-data-collector';

export const VeniaProductRecommendations = props => {
    const rendered = useRef([]);
    const { units } = useRecsTrackingProps(props);
    const { observeUnit } = useObserver();

    const classes = mergeClasses(defaultClasses, props.classes);
    const galleryClasses = mergeClasses(defaultClasses, props.galleryClasses);
    const itemClasses = mergeClasses(defaultClasses, props.itemClasses);

    const galleryUnits = units.map(recommendationUnit => {
        if (recommendationUnit.totalProducts < 1) {
            return null;
        }

        const items = recommendationUnit.products.map(shapeItem);
        return (
            <div
                key={recommendationUnit.unitId}
                data-unit-id={recommendationUnit.unitId}
                className={classes.root}
                ref={element => observeUnit(recommendationUnit, element)}
            >
                <div className={classes.unitTitle}>
                    {recommendationUnit.storefrontLabel}
                </div>
                <Gallery
                    galleryClasses={galleryClasses}
                    itemClasses={itemClasses}
                    items={items}
                />
            </div>
        );
    });

    if (units && units.length > 0) {
        units.forEach(recUnit => {
            if (
                recUnit.totalProducts > 0 &&
                !rendered.current.includes(recUnit.unitId)
            ) {
                mse.publish.recsUnitRender(recUnit.unitId);
                rendered.current.push(recUnit.unitId);
            }
        });

        return <div>{galleryUnits}</div>;
    } else {
        return null;
    }
};

VeniaProductRecommendations.propTypes = {
    galleryClasses: shape({
        filters: string,
        items: string,
        root: string
    }),
    itemClasses: shape({
        image: string,
        imageContainer: string,
        imagePlaceholder: string,
        image_pending: string,
        images: string,
        images_pending: string,
        name: string,
        name_pending: string,
        price: string,
        price_pending: string,
        root: string,
        root_pending: string
    }),
    classes: shape({
        unitTitle: string,
        root: string
    }),
    pageType: string.isRequired
};

// format data for GalleryItem, exported for testing
export const shapeItem = item => {
    if (item) {
        const { url, image, prices, productId, currency, type } = item;

        // derive the url_key and url_suffix from the url
        // example url --> https://magento.com/blah/blah/url_key.url_suffix
        const urlArray = String(url)
            .split('/')
            .splice(-1)[0]
            .split('.');
        const url_key = urlArray[0];
        const url_suffix = `.${urlArray[1]}`;

        const price = {
            regularPrice: {
                amount: {
                    value: prices.minimum.regular,
                    currency
                }
            }
        };

        return {
            ...item,
            id: productId,
            small_image: image,
            url_key,
            url_suffix,
            price,
            // use inStock when the recs service provides it, use the commented out line below:
            // stock_status: inStock ? "IN_STOCK" : "OUT_OF_STOCK";
            stock_status: 'IN_STOCK',
            type_id: type
        };
    } else return null;
};
