import React, { Component, Fragment } from 'react';
import { string, shape, func } from 'prop-types';
import errorImg from './hanger.svg';
import classify from 'src/classify';
import defaultClasses from './image.css';

class Image extends Component {
    static propTypes = {
        classes: shape({
            iconImage: string,
            image: string,
            imagePlaceholder: string,
            imagePlaceholder_pending: string,
            image_error: string,
            image_pending: string,
            root: string
        }),
        placeholder: func,
        height: string,
        iconHeight: string,
        alt: string.isRequired,
        src: string.isRequired,
        width: string
    };

    static defaultProps = {
        iconHeight: '32'
    };

    state = {
        isError: false,
        showImage: false
    };

    static getDerivedStateFromProps(props) {
        const { isOnline, hasBeenOffline } = props;
        if (isOnline && hasBeenOffline) {
            return { isError: false };
        } else {
            return null;
        }
    }

    handleLoad = () => {
        this.setState({
            showImage: true
        });
    };

    handleError = () => {
        this.setState({
            isError: true,
            showImage: false
        });
    };

    get imagePlaceholder() {
        const { placeholder, classes } = this.props;
        const { showImage } = this.state;

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
                <img
                    className={classes.iconImage}
                    src={errorImg}
                    alt="error"
                    height={iconHeight}
                />
            </div>
        );
    }

    get image() {
        const { alt, width, height, src, classes } = this.props;
        const { handleLoad, handleError, imagePlaceholder } = this;
        const { showImage } = this.state;

        const className = showImage ? classes.image : classes.image_pending;

        return (
            <Fragment>
                {imagePlaceholder}
                <img
                    className={className}
                    src={src}
                    alt={alt}
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
