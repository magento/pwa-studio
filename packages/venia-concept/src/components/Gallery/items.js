import React, { Component } from 'react';
import { arrayOf, string, number, shape } from 'prop-types';
import GalleryItem from './item';

const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);

// inline the placeholder elements, since they're constant
const defaultPlaceholders = emptyData.map((_, index) => (
    <GalleryItem key={index} placeholder={true} />
));

class GalleryItems extends Component {
    static propTypes = {
        imageSourceWidths: arrayOf(number),
        imageSizeBreakpoints: string,
        items: arrayOf(
            shape({
                id: number.isRequired,
                name: string.isRequired,
                small_image: string.isRequired,
                price: shape({
                    regularPrice: shape({
                        amount: shape({
                            value: number.isRequired
                        }).isRequired
                    }).isRequired
                }).isRequired
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
        const { imageSourceWidths, imageSizeBreakpoints, items } = this.props;

        if (items === emptyData) {
            return this.placeholders;
        }

        return items.map(item => (
            <GalleryItem
                key={item.id}
                imageSourceWidths={imageSourceWidths}
                imageSizeBreakpoints={imageSizeBreakpoints}
                item={item}
            />
        ));
    }
}

export { GalleryItems as default, emptyData };
