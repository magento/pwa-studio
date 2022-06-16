import React, { useMemo, useState } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import Select from '@magento/venia-ui/lib/components/Select';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from '../../css/orderIncidences.module.css';
import { useOrderIncidence } from '../../talons/useOrderIncidence';
import Image from '@magento/venia-ui/lib/components/Image';
import UploadImages from '../UploadImages';
import { isRequired } from '../../util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

const OrderIncidence = props => {
    const { incidence, orderItems, incidencesImages, setIncidencesImages } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const IMAGE_WIDTH = 200;

    const { productSelected, imagesData, handleProductSelected, setImagesValues } = useOrderIncidence({
        orderItems,
        incidence,
        incidencesImages,
        setIncidencesImages
    });

    const comboItemsRefs = useMemo(() => {
        if (orderItems != null) {
            return orderItems.map((item, index) => {
                let qtyValuesArray = [];
                for (let qty = 1; qty <= item.quantity_ordered; qty++) {
                    qtyValuesArray.push({ label: qty, value: qty });
                }

                const image =
                    item.product_sku != null && imagesData[item.product_sku] != null
                        ? imagesData[item.product_sku].thumbnail.url
                        : null;

                return {
                    id: incidence.id,
                    label: item.product_sku,
                    value: item.product_sku,
                    urlImage: item.product_url_key,
                    qtyValues: qtyValuesArray,
                    image: image
                };
            });
        }

        return [];
    }, [orderItems]);

    const selectedImage =
        comboItemsRefs[productSelected] != null ? (
            <Image
                alt={comboItemsRefs[productSelected].label}
                resource={comboItemsRefs[productSelected].image ? comboItemsRefs[productSelected].image : ''}
                width={IMAGE_WIDTH}
            />
        ) : null;

    return (
        <div className={classes.incidenceContainer} id={'incidence' + incidence.id}>
            <div className={classes.itemHeader}>
                <label className={classes.itemTitle}>
                    <FormattedMessage id={'singleOrderIncidence.title'} defaultMessage={'Order Incidence'} />:{' '}
                    {incidence.id}
                </label>
            </div>
            <div className={classes.itemRow}>
                <div className={classes.referencesContainer}>
                    <Field
                        id={'reference' + incidence.id}
                        label={formatMessage({ id: 'orderIncidences.reference', defaultMessage: 'Reference' })}
                    >
                        {comboItemsRefs.length > 1 ? (
                            <Select
                                field={'reference' + incidence.id}
                                items={comboItemsRefs}
                                initialValue={comboItemsRefs[productSelected].value}
                                onChange={handleProductSelected}
                            />
                        ) : (
                            <label>
                                <span className={classes.hide}>
                                    <TextInput
                                        field={'reference' + incidence.id}
                                        initialValue={orderItems[0].product_sku}
                                    />
                                </span>
                                {orderItems != null ? orderItems[0].product_sku : null}
                            </label>
                        )}
                    </Field>
                    <Field
                        id={'units' + incidence.id}
                        label={formatMessage({ id: 'orderIncidences.units', defaultMessage: 'Units' })}
                    >
                        {comboItemsRefs.length > 1 ? (
                            <Select
                                field={'units' + incidence.id}
                                initialValue={comboItemsRefs[productSelected].qtyValues[0].value}
                                items={comboItemsRefs[productSelected].qtyValues}
                            />
                        ) : (
                            <label>
                                <span className={classes.hide}>
                                    <TextInput
                                        field={'units' + incidence.id}
                                        initialValue={orderItems[0].quantity_ordered}
                                    />
                                </span>
                                {orderItems[0].quantity_ordered}
                            </label>
                        )}
                    </Field>
                </div>
                <div className={classes.galleryImage}>{selectedImage}</div>
            </div>
            <div className={classes.textAreaContainer}>
                <Field label={formatMessage({ id: 'orderIncidences.description', defaultMessage: 'Description' })}>
                    <TextArea
                        id={'description' + incidence.id}
                        validate={combine([[isRequired, 'description' + incidence.id]])}
                        field={'description' + incidence.id}
                    />
                </Field>
            </div>
            <UploadImages field={'images' + incidence.id} setImagesValues={setImagesValues} />
        </div>
    );
};

export default OrderIncidence;
