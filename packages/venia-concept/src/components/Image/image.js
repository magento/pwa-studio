import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './image.css';
import { transparentPlaceholder } from 'src/shared/images';

class Image extends Component {
    static propTypes = {
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
        })
        onError();
    }

    get error() {
        return (
            <div>HEY</div>
            );
    }

    get placeholder() {
        const {
            width,
            height,
            showImage,
            classes
        } = this.props;

        const className = showImage
            ? classes.imagePlaceholder
            : classes.imagePlaceholder_pending;

        console.log("rendered");
        return (
            <img
                className={className}
                src={transparentPlaceholder}
                alt=""
                width={width}
                height={height}
            />

        )

    }
    get image() {
        const {
            name,
            width,
            height,
            src,
            showImage,
            classes
        } = this.props;

        const {
            placeholder,
            handleLoad,
            handleError
        } = this;

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
                {/* showImage ?
                        null :
                        placeholder

*/}
            </Fragment>

        );

    }

    render() {
        const {
            classes
        } = this.props;

        const {
            error,
            image
        } = this;

        return (
            <div className={classes.root}>
                {
                    this.state.isError ?
                    error
                    : image
                }
            </div>
        );
    }
}

export default classify(defaultClasses)(Image);
