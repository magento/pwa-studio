import React from 'react';
import defaultClasses from './products.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { arrayOf, bool, number, oneOf, shape, string } from 'prop-types';
import SlickSlider from 'react-slick';
import Gallery from '@magento/venia-ui/lib/components/Gallery';
import { gql, useQuery } from '@apollo/client';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';

/**
 * Sort products based on the original order of SKUs
 *
 * @param {Array} skus
 * @param {Array} products
 * @returns {Array}
 */
const restoreSortOrder = (skus, products) => {
    const productsBySku = new Map();
    products.forEach(product => {
        productsBySku.set(product.sku, product);
    });
    return skus.map(sku => productsBySku.get(sku)).filter(Boolean);
};

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
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
 * @returns {React.Element} A React component that displays a Products based on a number of skus.
 */
const Products = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
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
        skus = [],
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
        slideToShowSmall = 2,
        slideToShowSmallCenterMode = 1
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

    const { loading, error, data } = useQuery(GET_PRODUCTS_BY_SKU, {
        variables: { skus, pageSize: skus.length }
    });

    if (loading) return null;

    if (error || data.products.items.length === 0) {
        return null;
    }

    const items = restoreSortOrder(skus, data.products.items);

    if (appearance === 'carousel') {
        const galleryItems = items.map((item, index) => {
            return <GalleryItem key={index} item={mapGalleryItem(item)} />;
        });

        //Settings conditions was made due to react-slick issues
        const carouselCenterMode =
            carouselMode === 'continuous' && items.length > slidesToShow;
        const carouselSmallCenterMode =
            carouselMode === 'continuous' &&
            items.length > slideToShowSmallCenterMode;
        const carouselSettings = {
            slidesToShow: slidesToShow,
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
                            ? slideToShowSmallCenterMode
                            : slideToShowSmall,
                        slidesToScroll: carouselSmallCenterMode
                            ? slideToShowSmallCenterMode
                            : slideToShowSmall,
                        centerMode: carouselSmallCenterMode,
                        ...(carouselSmallCenterMode && { centerPadding }),
                        ...{
                            infinite:
                                items.length > slideToShowSmall && infinite
                        }
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
                <SlickSlider {...carouselSettings}>{galleryItems}</SlickSlider>
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
 * @property {Array} skus List of SKUs to load into product list
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
    skus: arrayOf(string),
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
    slidesToShowSmall: number,
    slidesToShowSmallCenterMode: number
};

export default Products;

export const GET_PRODUCTS_BY_SKU = gql`
    query getProductsBySku($skus: [String], $pageSize: Int!) {
        products(filter: { sku: { in: $skus } }, pageSize: $pageSize) {
            items {
                id
                name
                sku
                small_image {
                    url
                }
                url_key
                url_suffix
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
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
