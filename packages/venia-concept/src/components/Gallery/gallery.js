import React, { useMemo, useEffect } from 'react';
import { string, shape, array } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import GalleryItemShimmer from '@magento/venia-ui/lib/components/Gallery/item.shimmer';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/gallery.module.css';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';
import { useDownloadCsvContext } from '@orienteed/customComponents/components/DownloadCsvProvider/downloadCsvProvider';

import Icon from '@magento/venia-ui/lib/components/Icon';
import { useHistory } from 'react-router-dom';
import { ArrowRight } from 'react-feather';

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
                <span>Recommended products</span>
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
                        urlKeys={
                            location.search.length
                                ? {
                                      items: items.map(ele => ({
                                          url_key: ele.url_key,
                                          url_suffix: ele.url_suffix,
                                          name: ele.name,
                                          __typename: ele.__typename,
                                          sku: ele.sku
                                      }))
                                  }
                                : null
                        }
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
        <div
            data-cy="Gallery-root"
            className={classes.root}
            aria-live="polite"
            aria-busy="false"
        >
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
