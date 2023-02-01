import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import { useStyle } from '../../../../classify';
import Table from '../../../Table';
import defaultClasses from './alertTable.module.css';

const AlertTable = props => {
    const { items, submitDeleteAlert } = props;
    const classes = useStyle(defaultClasses);
    const { formatMessage } = useIntl();
    
    const tableHeader = [
        <FormattedMessage id={'productAlert.productName'} defaultMessage={'Product Name'} />,
        <FormattedMessage id={'rmaPage.sku'} defaultMessage={'SKU'} />,
        <FormattedMessage id={'productAlert.alertStatus'} defaultMessage={'Alert Status'} />,
        <FormattedMessage id={'productAlert.subscribedOn'} defaultMessage={'Subscribed On'} />,
        <FormattedMessage id={'productAlert.actions'} defaultMessage={'Actions'} />
    ];
    const tableRows = items?.map(req => {
        return [
            {
                dataLable: formatMessage({
                    id: 'productAlert.productName',
                    defaultMessage: 'Product Name'
                }),
                value: 'staticr name'
            },
            {
                dataLable: formatMessage({
                    id: 'rmaPage.sku',
                    defaultMessage: 'SKU'
                }),
                value: req.product_id
            },
            {
                dataLable: formatMessage({
                    id: 'productAlert.alertStatus',
                    defaultMessage: 'Alert Status'
                }),
                value: `${req.status}`
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
                    id: 'global.delete',
                    defaultMessage: 'Delete'
                }),
                value: (
                    <a href onClick={() => submitDeleteAlert(req.subscriber_id  )} className={classes.actionBtn}>
                        <FormattedMessage id={'global.delete'} defaultMessage="Delete" />
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
