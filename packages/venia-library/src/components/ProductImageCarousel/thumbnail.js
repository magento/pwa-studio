import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { resourceUrl } from 'src/drivers';
import { mergeClasses } from 'src/classify';
import defaultClasses from './thumbnail.css';
import { transparentPlaceholder } from 'src/shared/images';
import { useWindowSize } from '@magento/peregrine';

function Thumbnail(props) {
    const windowSize = useWindowSize();

    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        isActive,
        item: { file, label },
        onClickHandler,
        itemIndex
    } = props;

    const src = file
        ? resourceUrl(file, { type: 'image-product', width: 240 })
        : transparentPlaceholder;

    const isDesktop = windowSize.innerWidth >= 1024;

    const handleClick = useCallback(() => {
        onClickHandler(itemIndex);
    }, [onClickHandler, itemIndex]);

    return (
        <button
            onClick={handleClick}
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
