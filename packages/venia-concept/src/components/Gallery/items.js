import React, { Component } from 'react';
import { arrayOf, number, shape } from 'prop-types';
import GalleryItem from './item';

const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);

// inline the placeholder elements, since they're constant
const defaultPlaceholders = emptyData.map((_, index) => (
    <GalleryItem key={index} placeholder={true} />
));

class GalleryItems extends Component {
    static propTypes = {
        items: arrayOf(
            shape({
                id: number.isRequired
            })
        ).isRequired,
        pageSize: number
    };

    get placeholders() {
        const { pageSize } = this.props;

        return pageSize
            ? Array.from({ length: pageSize })
                  .fill(null)
                  .map((_, index) => (
                      <GalleryItem key={index} placeholder={true} />
                  ))
            : defaultPlaceholders;
    }

    // map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
    mapGalleryItem(item) {
        const { small_image } = item;
        return {
            ...item,
            small_image:
                typeof small_image === 'object' ? small_image.url : small_image
        };
    }

    render() {
        const { items } = this.props;

        if (items === emptyData) {
            return this.placeholders;
        }

        return items.map(item => (
            <GalleryItem key={item.id} item={this.mapGalleryItem(item)} />
        ));
    }
}

export { GalleryItems as default, emptyData };
