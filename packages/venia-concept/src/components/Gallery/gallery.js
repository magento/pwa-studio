import React, { Component } from 'react';
import { string, shape, arrayOf, number } from 'prop-types';

import classify from 'src/classify';
import GalleryItems, { emptyData } from './items';
import defaultClasses from './gallery.css';

class Gallery extends Component {
    static IMAGE_SIZE_BREAKPOINTS =
        '(max-width: 640px) 40vw, (max-width: 1024px) 20vw';
    static IMAGE_SOURCE_WIDTHS = [160, 320, 480, 640, 800];
    static propTypes = {
        classes: shape({
            filters: string,
            items: string,
            pagination: string,
            root: string
        }),
        data: arrayOf(
            shape({
                id: number.isRequired,
                name: string.isRequired,
                small_image: string.isRequired,
                price: shape({
                    regularPrice: shape({
                        amount: shape({
                            value: number.isRequired,
                            currency: string.isRequired
                        }).isRequired
                    }).isRequired
                }).isRequired
            })
        ),
        pageSize: number
    };

    static defaultProps = {
        data: emptyData
    };

    render() {
        const { classes, data, pageSize } = this.props;
        const hasData = Array.isArray(data) && data.length;
        const items = hasData ? data : emptyData;

        return (
            <div className={classes.root}>
                <div className={classes.items}>
                    <GalleryItems
                        imageSizeBreakpoints={Gallery.IMAGE_SIZE_BREAKPOINTS}
                        imageSourceWidths={Gallery.IMAGE_SOURCE_WIDTHS}
                        items={items}
                        pageSize={pageSize}
                    />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Gallery);
