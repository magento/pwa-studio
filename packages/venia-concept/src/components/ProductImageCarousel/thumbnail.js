import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './thumbnail.css';
import ResponsiveImage from 'src/components/ResponsiveImage';
import { transparentPlaceholder } from 'src/shared/images';

class Thumbnail extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { classes, item } = this.props;
        const image = item.file ? (
            <ResponsiveImage
                alt={item.label}
                className={classes.image}
                sizes="1.2vw"
                widthOptions={[160, 360]}
                type="product"
                src={item.file}
            />
        ) : (
            <img
                className={classes.image}
                src={transparentPlaceholder}
                alt={item.label}
            />
        );
        return <div className={classes.root}>{image}</div>;
    }
}

export default classify(defaultClasses)(Thumbnail);
