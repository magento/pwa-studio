import React, { Component, Fragment } from 'react';
import { string, shape, func, bool } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './image.css';
import { transparentPlaceholder } from 'src/shared/images';

class Image extends Component {
    static propTypes = {
        classes: shape({
            image_error: string,
            image_pending: string,
            image: string,
            imagePlaceholder_pending: string,
            imagePlaceholder: string,
            root: string
        }),
        height: string,
        name: string,
        onError: func,
        onLoad: func,
        showImage: bool,
        src: string,
        width: string
    };

    state = {
        isError: false
    };

    handleLoad = () => {
        const { onLoad } = this.props;
        onLoad();
    };

    handleError = () => {
        const { onError } = this.props;
        this.setState({
            isError: true
        });
        onError();
    };

    get error() {
        const { classes } = this.props;
        return (
            <div className={classes.image_error}>
                <img
                    src="https://www.bargreen.com/media/catalog/product/cache/1/image/650x/040ec09b1e35df139433887a97daa66f/placeholder/default/Sorrynoimagesmall.jpg"
                    alt="error"
                />
            </div>
        );
    }

    get placeholder() {
        const { width, height, showImage, classes } = this.props;

        const className = showImage
            ? classes.imagePlaceholder
            : classes.imagePlaceholder_pending;

        return (
            <img
                className={className}
                src={transparentPlaceholder}
                alt=""
                width={width}
                height={height}
            />
        );
    }
    get image() {
        const { name, width, height, src, showImage, classes } = this.props;

        const { placeholder, handleLoad, handleError } = this;

        const className = showImage ? classes.image : classes.image_pending;

        return (
            <Fragment>
                <img
                    className={className}
                    src={src}
                    alt={name}
                    width={width}
                    height={height}
                    onLoad={handleLoad}
                    onError={handleError}
                />
                {placeholder}
            </Fragment>
        );
    }

    render() {
        const { classes } = this.props;

        const { error, image } = this;

        return (
            <div className={classes.root}>
                {this.state.isError ? error : image}
            </div>
        );
    }
}

export default classify(defaultClasses)(Image);
