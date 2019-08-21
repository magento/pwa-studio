import React, { useCallback, useMemo } from 'react';
import { bool, func, number, shape, string } from 'prop-types';

import { resourceUrl } from '@magento/venia-drivers';
import { mergeClasses } from '../../classify';
import defaultClasses from './thumbnail.css';
import { transparentPlaceholder } from '../../shared/images';
import Image from '../Image';
import { useWindowSize } from '@magento/peregrine';

const DEFAULT_THUMBNAIL_WIDTH = 240;
const DEFAULT_THUMBNAIL_HEIGHT = 300;

const Thumbnail = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        isActive,
        item: { file, label },
        onClickHandler,
        itemIndex
    } = props;

    const windowSize = useWindowSize();
    const isDesktop = windowSize.innerWidth >= 1024;

    const thumbnailImage = useMemo(() => {
        const src = file
            ? resourceUrl(file, {
                  type: 'image-product',
                  width: DEFAULT_THUMBNAIL_WIDTH,
                  height: DEFAULT_THUMBNAIL_HEIGHT
              })
            : transparentPlaceholder;

        return isDesktop ? (
            <Image
                alt={label}
                classes={{ root: classes.image }}
                placeholder={transparentPlaceholder}
                src={src}
            />
        ) : null;
    }, [file, isDesktop, label, classes.image]);

    const handleClick = useCallback(() => {
        onClickHandler(itemIndex);
    }, [onClickHandler, itemIndex]);

    return (
        <button
            onClick={handleClick}
            className={isActive ? classes.rootSelected : classes.root}
        >
            {thumbnailImage}
        </button>
    );
};

Thumbnail.propTypes = {
    classes: shape({
        root: string,
        rootSelected: string
    }),
    isActive: bool,
    item: shape({
        label: string,
        file: string.isRequired
    }),
    itemIndex: number,
    onClickHandler: func.isRequired
};

export default Thumbnail;
