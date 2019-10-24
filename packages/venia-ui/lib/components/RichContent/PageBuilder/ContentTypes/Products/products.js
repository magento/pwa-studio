import React from 'react';
import defaultClasses from './products.css';
import sliderClasses from '../Slider/slider.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, bool, number, oneOf, shape, string } from 'prop-types';
import SlickSlider from 'react-slick';
import Gallery from '../../../../Gallery';
import GET_PRODUCTS_BY_SKU from '../../../../../queries/getProductsBySku.graphql';
import { useQuery } from '@apollo/react-hooks';
import GalleryItem from '../../../../Gallery/item';

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
    return skus.map(sku => productsBySku.get(sku));
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
    let classes = mergeClasses(defaultClasses, props.classes);
    const {
        appearance,
        slideAll,
        autoplay,
        autoplaySpeed,
        infinite,
        arrows,
        dots,
        centerMode,
        centerPadding,
        skus,
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
        cssClasses = []
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
        variables: { skus }
    });

    if (loading) return null;

    if (error || data.products.items.length === 0) {
        return (
            <div
                style={dynamicStyles}
                className={[classes.root, ...cssClasses].join(' ')}
            >
                <div className={classes.error}>{'No products to display'}</div>
            </div>
        );
    }

    const items = restoreSortOrder(skus, data.products.items);

    if (appearance === 'carousel') {
        const galleryItems = items.map((item, index) => {
            if (item === null) {
                return <GalleryItem key={index} />;
            }
            return <GalleryItem key={index} item={mapGalleryItem(item)} />;
        });
        const sliderSettings = {
            slidesToShow: 3,
            slidesToScroll: slideAll ? 3 : 1,
            autoplay,
            autoplaySpeed,
            arrows,
            dots,
            centerMode,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: slideAll ? 2 : 1,
                        centerMode: false
                    }
                }
            ],
            ...(centerMode && { centerPadding }),
            ...(!centerMode && infinite && { infinite })
        };
        classes = mergeClasses(classes, sliderClasses);
        const centerModeClass = centerMode ? classes.centerMode : null;

        return (
            <div
                style={dynamicStyles}
                className={[classes.root, ...cssClasses, centerModeClass].join(
                    ' '
                )}
            >
                <SlickSlider {...sliderSettings}>{galleryItems}</SlickSlider>
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
 * @property {String} classes.galleryItems CSS class to modify child gallery items
 * @property {String} classes.error CSS class for displaying fetch errors
 * @property {String} appearance Sets products appearance
 * @property {Boolean} slideAll Slide all slides
 * @property {Boolean} autoplay Whether the slider should autoplay
 * @property {Number} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {Boolean} infinite Whether to infinitely scroll the slider
 * @property {Boolean} arrows Whether to show arrows on the slide for navigation
 * @property {Boolean} dots Whether to show navigation dots at the bottom of the slider
 * @property {Boolean} centerMode Highlights center slide
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
 */
Products.propTypes = {
    classes: shape({
        root: string,
        galleryItems: string,
        error: string
    }),
    appearance: oneOf(['grid', 'carousel']),
    slideAll: bool,
    autoplay: bool,
    autoplaySpeed: number,
    infinite: bool,
    arrows: bool,
    dots: bool,
    centerMode: bool,
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
    cssClasses: arrayOf(string)
};

export default Products;
