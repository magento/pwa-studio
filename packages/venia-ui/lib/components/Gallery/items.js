import React, { Component, memo, useMemo } from 'react';
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
// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const GalleryItemsContainer = props => {
    const { items } = props;
    const newItems = useMemo(
        () => (items === emptyData ? items : items.map(mapGalleryItem)),
        [items]
    );
    const newProps = { ...props, items: newItems };
    return <PureGalleryItems {...newProps} />;
};

export { GalleryItemsContainer as default, emptyData };
