import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { resourceUrl } from 'src/drivers';
import { mergeClasses } from 'src/classify';
import defaultClasses from './thumbnail.css';
import { transparentPlaceholder } from 'src/shared/images';
import { WindowSizeContext } from 'src/components/App/WindowSizeContext';

function Thumbnail(props) {
    const { windowSize } = useContext(WindowSizeContext);
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        isActive,
        item: { file, label }
    } = props;

    const src = file
        ? resourceUrl(file, { type: 'image-product', width: 240 })
        : transparentPlaceholder;

    const isDesktop = windowSize.innerWidth >= 1024;

    function onClickHandlerWrapper() {
        const { onClickHandler, itemIndex } = props;
        onClickHandler(itemIndex);
    }

    return (
        <button
            onClick={onClickHandlerWrapper}
            className={isActive ? classes.rootSelected : classes.root}
        >
            {isDesktop ? (
                <img className={classes.image} src={src} alt={label} />
            ) : null}
        </button>
    );
}

Thumbnail.propTypes = {
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

export default Thumbnail;
