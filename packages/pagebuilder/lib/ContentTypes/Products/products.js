import React, { useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { arrayOf, bool, number, oneOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Gallery from '@magento/venia-ui/lib/components/Gallery';
import Carousel from './Carousel/carousel';
import defaultClasses from './products.module.css';
/**
 * Sort products based on the original order
 *
 * @param {Array} urlKeys
 * @param {Array} products
 * @returns {Array}
 */
const restoreSortOrder = (urlKeys, products) => {
    const productsByOriginalOrder = new Map();
    products.forEach(product => {
        productsByOriginalOrder.set(product.url_key, product);
    });
    return urlKeys
        .map(urlKey => productsByOriginalOrder.get(urlKey))
        .filter(Boolean);
};

/**
 * Page Builder Products component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Products
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Products based on a number of products
 */
const Products = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        appearance,
        autoplay,
        autoplaySpeed,
        infinite,
        arrows,
        dots,
        draggable = false,
        carouselMode,
        centerPadding,
        pathNames = [],
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        slidesToShow = 5,
        slidesToShowMedium = 4,
        slidesToShowSmall = 2,
        slidesToShowSmallCenterMode = 1
    } = props;

    const dynamicStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const { data: storeConfigData } = useQuery(GET_STORE_CONFIG_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const productUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    const urlKeys = pathNames.map(pathName => {
        const slug = pathName.split('/').pop();
        return productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;
    });

    const { loading, error, data } = useQuery(GET_PRODUCTS_BY_URL_KEY, {
        variables: { url_keys: urlKeys, pageSize: urlKeys.length },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    if (loading) return null;

    if (error || data.products.items.length === 0) {
        return null;
    }

    const items = restoreSortOrder(urlKeys, data.products.items);

    if (appearance === 'carousel') {
        //Settings conditions was made due to react-slick issues
        const carouselCenterMode =
            carouselMode === 'continuous' && items.length > slidesToShow;
        const carouselSmallCenterMode =
            carouselMode === 'continuous' &&
            items.length > slidesToShowSmallCenterMode;
        const carouselSettings = {
            slidesToShow,
            slidesToScroll: slidesToShow,
            draggable,
            autoplay,
            autoplaySpeed,
            arrows,
            dots,
            centerMode: carouselCenterMode,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: carouselSmallCenterMode
                            ? slidesToShowSmallCenterMode
                            : slidesToShowSmall,
                        slidesToScroll: carouselSmallCenterMode
                            ? slidesToShowSmallCenterMode
                            : slidesToShowSmall,
                        centerMode: carouselSmallCenterMode,
                        ...(carouselSmallCenterMode && { centerPadding }),
                        ...{
                            infinite:
                                items.length > slidesToShowSmall && infinite
                        }
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: slidesToShowSmall + 1,
                        slidesToScroll: slidesToShowSmall + 1
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: slidesToShowMedium,
                        slidesToScroll: slidesToShowMedium
                    }
                }
            ],
            ...(carouselCenterMode && { centerPadding }),
            ...{ infinite: items.length > slidesToShow && infinite }
        };

        const centerModeClass = carouselCenterMode ? classes.centerMode : null;
        const centerModeSmallClass = carouselSmallCenterMode
            ? classes.centerModeSmall
            : null;

        return (
            <div
                style={dynamicStyles}
                className={[
                    classes.carousel,
                    ...cssClasses,
                    centerModeClass,
                    centerModeSmallClass
                ].join(' ')}
            >
                <Carousel settings={carouselSettings} items={items} />
            </div>
        );
    }

    return (
        <div
            style={dynamicStyles}
            className={[classes.root, ...cssClasses].join(' ')}
        >
            <Gallery items={items} classes={{ items: classes.galleryItems }} />
        </div>
    );
};

/**
 * Props for {@link Products}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Products
 * @property {String} classes.root CSS class for products
 * @property {String} classes.carousel CSS class for products carousel appearance
 * @property {String} classes.centerMode CSS class for products carousel appearance with center mode
 * @property {String} classes.centerModeSmall CSS class for products carousel appearance with center mode on small screen
 * @property {String} classes.galleryItems CSS class to modify child gallery items
 * @property {String} classes.error CSS class for displaying fetch errors
 * @property {String} appearance Sets products appearance
 * @property {Boolean} autoplay Whether the carousel should autoplay
 * @property {Number} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {Boolean} infinite Whether to infinitely scroll the carousel
 * @property {Boolean} arrows Whether to show arrows on the slide for navigation
 * @property {Boolean} dots Whether to show navigation dots at the bottom of the carousel
 * @property {Boolean} draggable Enable scrollable via dragging on desktop
 * @property {String} carouselMode Carousel mode
 * @property {String} centerPadding Horizontal padding in centerMode
 * @property {Array} pathNames List of Url path names to load into product list
 * @property {String} textAlign Alignment of content within the products list
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 * @property {Number} slidesToShow # of slides to show at a time
 * @property {Number} slidesToShowMedium # of slides to show at a time on medium sized screens
 * @property {Number} slidesToShowSmall # of slides to show at a time on small screen
 * @property {Number} slidesToShowSmallCenterMode # of slides to show at a time on small screen in centerMode
 */
Products.propTypes = {
    classes: shape({
        root: string,
        carousel: string,
        centerMode: string,
        centerModeSmall: string,
        galleryItems: string,
        error: string
    }),
    appearance: oneOf(['grid', 'carousel']),
    autoplay: bool,
    autoplaySpeed: number,
    infinite: bool,
    arrows: bool,
    dots: bool,
    draggable: bool,
    carouselMode: oneOf(['default', 'continuous']),
    centerPadding: string,
    pathNames: arrayOf(string),
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string),
    slidesToShow: number,
    slidesToShowMedium: number,
    slidesToShowSmall: number,
    slidesToShowSmallCenterMode: number
};

export default Products;

export const GET_PRODUCTS_BY_URL_KEY = gql`
    query getProductsByUrlKey($url_keys: [String], $pageSize: Int!) {
        products(filter: { url_key: { in: $url_keys } }, pageSize: $pageSize) {
            items {
                id
                uid
                name
                price_range {
                    maximum_price {
                        final_price {
                            currency
                            value
                        }
                        regular_price {
                            currency
                            value
                        }
                        discount {
                            amount_off
                        }
                    }
                }
                sku
                small_image {
                    url
                }
                stock_status
                __typename
                url_key
            }
            total_count
            filters {
                name
                filter_items_count
                request_var
                filter_items {
                    label
                    value_string
                }
            }
        }
    }
`;

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
        }
    }
`;
