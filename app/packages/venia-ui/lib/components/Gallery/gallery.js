import React, { useMemo, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { string, shape, array } from 'prop-types';

import GalleryItem from './item';
import GalleryItemShimmer from './item.shimmer';

import { useDownloadCsvContext } from './DownloadCsvProvider/downloadCsvProvider';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';
import { useHistory } from 'react-router-dom';
import { useStyle } from '../../classify';

import defaultClasses from './gallery.module.css';

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
const Gallery = props => {
    const { items, filterState, pageBuilder } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useGallery();
    const { storeConfig } = talonProps;
    const { setGalleryItem } = useDownloadCsvContext();

    const { location } = useHistory();
    const isHomePage = location.pathname === '/';
    useEffect(() => {
        setGalleryItem(items);
    }, [items]);

    const recommendedProducts = (
        <>
            <div className={classes.recommendedWrapper}>
                <span>
                    <FormattedMessage id={'gellary.recommendedProducts'} defaultMessage={'Recommended products'} />
                </span>
            </div>
        </>
    );
    const galleryItems = useMemo(
        () =>
            items.map((item, index) => {
                if (item === null) {
                    return <GalleryItemShimmer key={index} />;
                }
                return (
                    <GalleryItem
                        pageBuilder={pageBuilder}
                        urlKeys={{
                            items: items.map(ele => ({
                                url_key: ele.url_key,
                                url_suffix: ele.url_suffix,
                                name: ele.name,
                                __typename: ele.__typename,
                                sku: ele.sku
                            }))
                        }}
                        key={item.id}
                        item={item}
                        storeConfig={storeConfig}
                        filterState={filterState}
                    />
                );
            }),
        [items, storeConfig]
    );

    return (
        <div data-cy="Gallery-root" className={classes.root} aria-live="polite" aria-busy="false">
            {isHomePage && recommendedProducts}
            <div className={classes.items}>{galleryItems}</div>
        </div>
    );
};

Gallery.propTypes = {
    classes: shape({
        filters: string,
        items: string,
        pagination: string,
        root: string
    }),
    items: array.isRequired
};

export default Gallery;
