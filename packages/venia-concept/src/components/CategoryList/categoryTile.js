import React, { Component } from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { Link } from 'react-router-dom';

import ResponsiveImage from 'src/components/ResponsiveImage';
import classify from 'src/classify';
import defaultClasses from './categoryTile.css';
import { tileImageSizes } from './categoryList.css';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
const categoryUrlSuffix = '.html';

class CategoryTile extends Component {
    static propTypes = {
        item: shape({
            image: string,
            name: string.isRequired,
            productImagePreview: shape({
                items: arrayOf(
                    shape({
                        small_image: string
                    })
                )
            }),
            url_key: string.isRequired
        }).isRequired,
        classes: shape({
            item: string,
            image: string,
            imageWrapper: string,
            name: string
        }).isRequired
    };

    get imageInfo() {
        if (!this.props.item) {
            return null;
        }
        const { image, productImagePreview } = this.props.item;
        if (image) {
            return {
                src: image,
                type: 'category'
            };
        }
        if (productImagePreview.items[0]) {
            return {
                src: productImagePreview.items[0].small_image,
                type: 'product'
            };
        }
    }

    render() {
        const { imageInfo, props } = this;
        const { classes, item } = props;

        let imagePreview = null;
        if (imageInfo && imageInfo.src && imageInfo.type) {
            imagePreview = (
                <ResponsiveImage
                    alt={item.name}
                    className={classes.image}
                    sizes={tileImageSizes}
                    widthOptions={[240, 640]}
                    src={imageInfo.src}
                    type={imageInfo.type}
                    render={(renderImage, setToUrl) => {
                        return (
                            <span
                                className={classes.imageWrapper}
                                ref={setToUrl('--venia-category-tile-image')}
                            >
                                {renderImage()}
                            </span>
                        );
                    }}
                />
            );
        }

        return (
            <Link
                className={classes.root}
                to={`/${item.url_key}${categoryUrlSuffix}`}
            >
                {imagePreview}
                <span className={classes.name}>{item.name}</span>
            </Link>
        );
    }
}

export default classify(defaultClasses)(CategoryTile);
