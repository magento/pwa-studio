import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './thumbnail.css';
import { makeProductMediaPath } from 'src/util/makeMediaPath';
import { transparentPlaceholder } from 'src/shared/images';

class Thumbnail extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        isActive: PropTypes.bool,
        item: PropTypes.shape({
            label: PropTypes.string,
            position: PropTypes.number,
            disabled: PropTypes.bool,
            file: PropTypes.string.isRequired
        }),
        itemIndex: PropTypes.number,
        onClickHandler: PropTypes.func.isRequired
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
        const src = file ? makeProductMediaPath(file) : transparentPlaceholder;

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
