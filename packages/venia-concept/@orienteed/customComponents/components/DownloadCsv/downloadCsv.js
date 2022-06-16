import React, { useEffect, useState } from 'react';
import CustomButton from './CustomButton/customButton';
import { FormattedMessage } from 'react-intl';
// import { useDownloadCsv } from '../../talons/DownloadCsv/useDownloadCsv';
import { useDownloadCsvContext } from '../DownloadCsvProvider/downloadCsvProvider';

import defaultClasses from './downloadCsv.module.css';
import { CSVLink } from 'react-csv';

import ProductSort from './ProductSort/productSort';

import { useSortCatalog } from '../../talons/DownloadCsv/useSortCatalog';

const DownloadCsv = () => {
    const { galleryItem, currentCatalog } = useDownloadCsvContext();
    const [data, setData] = useState();
    // const talonProps = useDownloadCsv();
    // const { catalogRegularPrice, catalogDiscountPrice } = talonProps;
    // const { handleFullCatalog } = talonProps;

    // useEffect(() => {
    //     handleFullCatalog().then(res => {
    //         setData(res);
    //     });
    // }, [handleFullCatalog]);

    // console.log('downloadCsv', data);
    const sortProps1 = useSortCatalog();

    let flatData;

    let newGalleryItemRegularPrice;
    let newGalleryItemDiscountPrice;

    let donwloadButton;

    if (galleryItem.length > 0) {
        newGalleryItemRegularPrice = galleryItem.map(item => {
            if (item.__typename === 'ConfigurableProduct' && item.variants) {
                return item.variants.map(variant => {
                    return {
                        // categorie: variant.product.categories[0].name, // the products from cloud doesn't have categories
                        description: variant.product.description.html,
                        name: variant.product.name,
                        price: variant.product.price.regularPrice.amount.value,
                        sku: variant.product.sku
                    };
                });
            } else {
                return {
                    // categorie: variant.product.categories[0].name, // the products from cloud doesn't have categories
                    description: 'not defined',
                    name: 'not defined',
                    price: 'not defined',
                    sku: 'not defined'
                };
            }
        });
    } else {
        return null;
    }

    if (galleryItem.length > 0) {
        newGalleryItemDiscountPrice = galleryItem.map(item => {
            if (item.__typename === 'ConfigurableProduct' && item.variants) {
                return item.variants.map(variant => {
                    return {
                        // categorie: variant.product.categories[0].name,
                        description: variant.product.description.html,
                        name: variant.product.name,
                        price: variant.product.price.minimalPrice.amount.value,
                        sku: variant.product.sku
                    };
                });
            } else {
                return {
                    // categorie: variant.product.categories[0].name, // the products from cloud doesn't have categories
                    description: 'not defined',
                    name: 'not defined',
                    price: 'not defined',
                    sku: 'not defined'
                };
            }
        });
    } else {
        return null;
    }

    // let flattenRegularPrice;
    // if (data) {
    //     flatData = data.flat();
    //     let newCatalogRegularPrice = flatData.map(product =>
    //         product.variants.map(variant => {
    //             return {
    //                 categorie: variant.product.categories[0].name,
    //                 description: variant.product.description.html,
    //                 name: variant.product.name,
    //                 price: variant.product.price.regularPrice.amount.value,
    //                 sku: variant.product.sku
    //             };
    //         })
    //     );
    //     flattenRegularPrice = newCatalogRegularPrice.flat();
    // } else {
    //     return null;
    // }

    // let flattenDiscountPrice;
    // if (data) {
    //     flatData = data.flat();
    //     let newCatalogDiscountPrice = flatData.map(product =>
    //         product.variants.map(variant => {
    //             return {
    //                 categorie: variant.product.categories[0].name,
    //                 description: variant.product.description.html,
    //                 name: variant.product.name,
    //                 price: variant.product.price.minimalPrice.amount.value,
    //                 sku: variant.product.sku
    //             };
    //         })
    //     );
    //     flattenDiscountPrice = newCatalogDiscountPrice.flat();
    // } else {
    //     return null;
    // }

    const flatNewGalleryItemRegularPrice = newGalleryItemRegularPrice.flat();
    const flatNewGalleryItemMinimalPrice = newGalleryItemDiscountPrice.flat();

    if (currentCatalog === 'fullCatalogPvP') {
        donwloadButton = (
            <CSVLink data={flattenRegularPrice}>
                <CustomButton priority={'high'}>
                    <FormattedMessage id={'download'} defaultMessage={'download'} />
                </CustomButton>
            </CSVLink>
        );
    } else if (currentCatalog === 'fullCatalogPersonal') {
        donwloadButton = (
            <CSVLink data={flattenDiscountPrice}>
                <CustomButton priority={'high'}>
                    <FormattedMessage id={'download'} defaultMessage={'download'} />
                </CustomButton>
            </CSVLink>
        );
    } else if (currentCatalog === 'thisCatalogPvP') {
        donwloadButton = (
            <CSVLink data={flatNewGalleryItemRegularPrice}>
                <CustomButton priority={'high'}>
                    <FormattedMessage id={'download'} defaultMessage={'download'} />
                </CustomButton>
            </CSVLink>
        );
    } else {
        donwloadButton = (
            <CSVLink data={flatNewGalleryItemMinimalPrice}>
                <CustomButton priority={'high'}>
                    <FormattedMessage id={'download'} defaultMessage={'download'} />
                </CustomButton>
            </CSVLink>
        );
    }

    return (
        <main className={defaultClasses.buttonContainer}>
            <article>{donwloadButton}</article>
            <section className={defaultClasses.sortContainer}>
                <ProductSort sortProps1={sortProps1} />
            </section>
        </main>
    );
};

export default DownloadCsv;
