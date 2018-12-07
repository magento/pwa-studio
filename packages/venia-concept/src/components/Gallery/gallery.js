import React, { Component } from 'react';
import { string, shape, arrayOf, number } from 'prop-types';

import classify from 'src/classify';
import GalleryItems, { emptyData } from './items';
import defaultClasses from './gallery.css';

class Gallery extends Component {
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
                    <GalleryItems items={items} pageSize={pageSize} />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Gallery);
