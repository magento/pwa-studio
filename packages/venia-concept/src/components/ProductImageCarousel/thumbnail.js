import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { resourceUrl } from 'src/drivers';
import classify from 'src/classify';
import defaultClasses from './thumbnail.css';
import { transparentPlaceholder } from 'src/shared/images';

class Thumbnail extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            rootSelected: PropTypes.string
        }),
        isActive: PropTypes.bool,
        item: PropTypes.shape({
            label: PropTypes.string,
            file: PropTypes.string.isRequired
        }),
        itemIndex: PropTypes.number,
        onClickHandler: PropTypes.func.isRequired
    };

    isDesktop = () => {
        return window.innerWidth > 640;
    };

    onClickHandlerWrapper = () => {
        const { onClickHandler, itemIndex } = this.props;
        onClickHandler(itemIndex);
    };

    render() {
        const {
            classes,
            isActive,
            item: { file, label }
        } = this.props;

        const src = file
            ? resourceUrl(file, {
                  type: 'image-product',
                  width: this.isDesktop() ? 240 : 640
              })
            : transparentPlaceholder;

        return (
            <button
                onClick={this.onClickHandlerWrapper}
                className={isActive ? classes.rootSelected : classes.root}
            >
                <img className={classes.image} src={src} alt={label} />
            </button>
        );
    }
}

export default classify(defaultClasses)(Thumbnail);
