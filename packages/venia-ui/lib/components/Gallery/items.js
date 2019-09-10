import React, { Component, memo } from 'react';
import { arrayOf, number, shape } from 'prop-types';
import GalleryItem from './item';

// TODO: This can be replaced by the value from `storeConfig when the PR,
// https://github.com/magento/graphql-ce/pull/650, is released.
const pageSize = 6;
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

    render() {
        const { items } = this.props;

        if (items === emptyData) {
            return this.placeholders;
        }

        return items.map(item => <GalleryItem key={item.id} item={item} />);
    }
}
const PureGalleryItems = memo(GalleryItems);
export { PureGalleryItems as default, emptyData };
