import React, { useMemo } from 'react';
import { bool, func, number, shape, string } from 'prop-types';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useWindowSize } from '@magento/peregrine';
import { useThumbnail } from '@magento/peregrine/lib/talons/ProductImageCarousel/useThumbnail';

import { useStyle } from '../../classify';
import defaultClasses from './thumbnail.module.css';
import Image from '../Image';

const DEFAULT_THUMBNAIL_HEIGHT = 170;
const DEFAULT_THUMBNAIL_WIDTH = 135;

/**
 * The Thumbnail Component is used for showing thumbnail preview image for ProductImageCarousel
 * Shows up only in desktop devices
 *
 * @typedef Thumbnail
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React thumbnail component that displays product thumbnail
 */
const Thumbnail = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        isActive,
        item: { file, label },
        onClickHandler,
        itemIndex
    } = props;

    const talonProps = useThumbnail({
        onClickHandler,
        itemIndex
    });

    const { handleClick } = talonProps;
    const selectedItem = isActive ? 'Current Image' : 'Next Image';
    const windowSize = useWindowSize();
    const isDesktop = windowSize.innerWidth >= 1024;

    const thumbnailImage = useMemo(() => {
        if (!isDesktop) {
            return null;
        }

        return file ? (
            <Image
                alt={label}
                classes={{ image: classes.image }}
                height={DEFAULT_THUMBNAIL_HEIGHT}
                resource={file}
                width={DEFAULT_THUMBNAIL_WIDTH}
            />
        ) : (
            <Image
                alt={label}
                classes={{ image: classes.image }}
                src={transparentPlaceholder}
            />
        );
    }, [file, isDesktop, label, classes.image]);

    return (
        <button
            type="button"
            className={isActive ? classes.rootSelected : classes.root}
            onClick={handleClick}
            aria-label={selectedItem}
        >
            {thumbnailImage}
        </button>
    );
};

/**
 * Props for {@link Thumbnail}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Thumbnail component
 * @property {string} classes.root classes for root container
 * @property {string} classes.rootSelected classes for the selected thumbnail item
 * @property {bool} isActive is image associated is active in carousel
 * @property {string} item.label label for image
 * @property {string} item.file filePath of image
 * @property {number} itemIndex index number of thumbnail
 * @property {func} onClickHandler A callback for handling click events on thumbnail
 */
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
