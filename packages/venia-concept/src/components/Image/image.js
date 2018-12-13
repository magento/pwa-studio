import React, { Component, Fragment } from 'react';
import { string, shape, func, bool } from 'prop-types';
import errorImg from './hanger.svg';
import classify from 'src/classify';
import defaultClasses from './image.css';

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
        iconHeight: string,
        name: string.isRequired,
        onError: func,
        onLoad: func,
        showImage: bool,
        src: string.isRequired,
        width: string
    };

    static defaultProps = {
        onError: () => {},
        onLoad: () => {},
        showImage: true,
        iconHeight: '32'
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

    get imagePlaceholder() {
        const { placeholder, showImage, classes } = this.props;

        const className = !showImage
            ? classes.imagePlaceholder
            : classes.imagePlaceholder_pending;

        return placeholder({ className: className });
    }

    get error() {
        const { classes, iconHeight, placeholder } = this.props;

        return (
            <div className={classes.image_error}>
                {placeholder({ className: classes.imagePlaceholder })}
                <img src={errorImg} alt="error" height={iconHeight} />
            </div>
        );
    }

    get image() {
        const { name, width, height, src, showImage, classes } = this.props;
        const { handleLoad, handleError, imagePlaceholder } = this;
        const className = showImage ? classes.image : classes.image_pending;

        return (
            <Fragment>
                {imagePlaceholder}
                <img
                    className={className}
                    src={src}
                    alt={name}
                    width={width}
                    height={height}
                    onLoad={handleLoad}
                    onError={handleError}
                />
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
