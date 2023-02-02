import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { useStyle } from '../../../../classify';
import Table from '../../../Table';
import Image from '../../../Image';
import PlaceholderImage from '../../../Image/placeholderImage';
import defaultClasses from './alertTable.module.css';

const AlertTable = props => {
    const { items, submitDeleteAlert } = props;
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();

    const thumbnailProps = {
        alt: 'product',
        classes: { root: classes.thumbnail },
        width: 87,
        height: 70
    };
    const thumbnailElement = thumbnail =>
        thumbnail ? <Image {...thumbnailProps} resource={thumbnail} /> : <PlaceholderImage {...thumbnailProps} />;

    const tableHeader = [
        <FormattedMessage id={'savedCartsView.productImage'} defaultMessage={'Image'} />,
        <FormattedMessage id={'orderItems.productName'} defaultMessage={'Product Name'} />,
        <FormattedMessage id={'compareProducts.sku'} defaultMessage={'SKU'} />,
        <FormattedMessage id={'productAlert.subscribedOn'} defaultMessage={'Subscribed On'} />,
        <FormattedMessage id={'wishlistMoreActionsDialog.title'} defaultMessage={'Actions'} />
    ];

    const tableRows = items?.map(req => {
        return [
            {
                dataLable: formatMessage({
                    id: 'savedCartsView.productImage',
                    defaultMessage: 'Image'
                }),
                value: thumbnailElement(req?.product_data?.product_image_url)
            },
            {
                dataLable: formatMessage({
                    id: 'orderItems.productName',
                    defaultMessage: 'Product Name'
                }),
                value: req?.product_data?.name
            },

            {
                dataLable: formatMessage({
                    id: 'compareProducts.sku',
                    defaultMessage: 'SKU'
                }),
                value: req?.product_data?.sku
            },
            {
                dataLable: formatMessage({
                    id: 'productAlert.subscribedOn',
                    defaultMessage: 'Subscribed On'
                }),
                value: moment(req.subscribe_created_at).format('LLL')
            },

            {
                dataLable: formatMessage({
                    id: 'global.deleteButton',
                    defaultMessage: 'Delete'
                }),
                value: (
                    <a href onClick={() => submitDeleteAlert(req.subscriber_id)} className={classes.actionBtn}>
                        <FormattedMessage id={'global.deleteButton'} defaultMessage="Delete" />
                    </a>
                )
            }
        ];
    });

    return (
        <div className={classes.tableContainer}>
            <Table headers={tableHeader} tableRows={tableRows} />
        </div>
    );
};

export default AlertTable;
