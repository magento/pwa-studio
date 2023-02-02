import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import moment from 'moment';

import defaultClasses from './shippingMethod.module.css';

const ShippingMethod = props => {
    const { data, mp_delivery_information, classes: propsClasses, config } = props;
    const { shipments, shippingMethod } = data;

    const { storeConfig } = config;

    moment.locale(storeConfig.locale);

    const classes = useStyle(defaultClasses, propsClasses);
    let trackingElement;
    const method = shippingMethod.split('-');
    const formatDeliveryDate = moment(new Date(mp_delivery_information?.mp_delivery_date)).format('L');

    const delveryTime = mp_delivery_information?.mp_delivery_time
        ?.split('-')
        ?.map(ele => ele.trim().slice(0, 5))
        .join('-');

    if (shipments.length) {
        trackingElement = shipments.map(shipment => {
            const { tracking: trackingCollection } = shipment;
            if (trackingCollection.length) {
                return trackingCollection.map(tracking => {
                    const { number } = tracking;

                    return (
                        <span className={classes.trackingRow} key={number}>
                            <FormattedMessage
                                id="orderDetails.trackingInformation"
                                defaultMessage="<strong>Tracking number:</strong> {number}"
                                values={{
                                    number,
                                    strong: chunks => <strong>{chunks}</strong>
                                }}
                            />
                        </span>
                    );
                });
            }
        });
    } else {
        trackingElement = (
            <FormattedMessage id="orderDetails.waitingOnTracking" defaultMessage="Waiting for tracking information" />
        );
    }

    return (
        <div className={classes.root} data-cy="OrderDetails-ShippingMethod-root">
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.shippingMethodLabel" defaultMessage="Shipping Method" />
            </div>
            <div className={classes.methodDetails}>
                <div className={classes.method}>
                    <span>{method[0].slice(0, method[0].length - 1)}:</span>
                    <span className={classes.methodValue}>{method[1]}</span>
                </div>
                <div className={classes.tracking}>{trackingElement}</div>
                <div>
                    {mp_delivery_information?.mp_delivery_date && mp_delivery_information?.mp_delivery_date !== '' && (
                        <div className={classes.method}>
                            <span>
                                <FormattedMessage id={'deliveryDate.deliveryDate'} defaultMessage={'Delivery Date'} />
                            </span>
                            &nbsp;
                            <span>{formatDeliveryDate}</span>
                        </div>
                    )}
                    {mp_delivery_information?.mp_delivery_time && mp_delivery_information?.mp_delivery_time != '' && (
                        <div className={classes.method}>
                            <span>
                                <FormattedMessage id={'deliveryDate.deliveryTime'} defaultMessage={'Delivery Time'} />
                            </span>
                            &nbsp;
                            <span>{delveryTime}</span>
                        </div>
                    )}
                    {mp_delivery_information?.mp_house_security_code &&
                        mp_delivery_information?.mp_house_security_code !== '' && (
                            <div className={classes.method}>
                                <span>
                                    <FormattedMessage
                                        id={'deliveryDate.houseSecurityCode'}
                                        defaultMessage={'House Security Code'}
                                    />
                                </span>
                                &nbsp;
                                <span>{mp_delivery_information?.mp_house_security_code}</span>
                            </div>
                        )}
                    {mp_delivery_information?.mp_delivery_comment &&
                        mp_delivery_information?.mp_delivery_comment !== '' && (
                            <div className={classes.method}>
                                <span>
                                    <FormattedMessage id={'deliveryDate.commentDate'} defaultMessage={'Comment Date'} />
                                </span>
                                &nbsp;
                                <span>{mp_delivery_information?.mp_delivery_comment}</span>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ShippingMethod;

ShippingMethod.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        method: string,
        tracking: string,
        trackingRow: string
    }),
    data: shape({
        shippingMethod: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        number: string
                    })
                )
            })
        )
    })
};
