import React from 'react';
import { mergeClasses } from '../../classify';

import defaultClasses from './orderRow.css';
import { Price } from '@magento/peregrine';
import OrderProgressBar from './orderProgressBar';
import { useOrderRow } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow';
import { ChevronDown, ChevronUp } from 'react-feather';
import Icon from '../Icon';

const OrderRow = props => {
    const { order } = props;
    const {
        invoices,
        number: orderNumber,
        order_date: orderDate,
        shipments,
        status,
        total
    } = order;
    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;

    const formattedDate = new Date(orderDate).toLocaleDateString(
        navigator.locale,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }
    );

    const hasInvoice = !!invoices.length;
    const hasShipment = !!shipments.length;
    const derivedStatus =
        status === 'Complete'
            ? 'Delivered'
            : hasShipment
            ? 'Shipped'
            : hasInvoice
            ? 'Ready to ship'
            : 'Processing';

    const talonProps = useOrderRow();
    const { isOpen, handleContentToggle } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const contentClass = isOpen ? classes.content : classes.content_collapsed;
    const contentToggleIconSrc = isOpen ? ChevronUp : ChevronDown;
    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={24} />;

    return (
        <li className={classes.root}>
            <div className={classes.orderNumberContainer}>
                <span className={classes.orderNumberLabel}>{'Order #'}</span>
                <span className={classes.orderNumber}>{orderNumber}</span>
            </div>
            <div className={classes.orderDateContainer}>
                <span className={classes.orderDateLabel}>{'Order Date'}</span>
                <span className={classes.orderDate}>{formattedDate}</span>
            </div>
            <div className={classes.orderTotalContainer}>
                <span className={classes.orderTotalLabel}>{'Order Total'}</span>
                <div className={classes.orderTotal}>
                    <Price currencyCode={currency} value={orderTotal} />
                </div>
            </div>
            <div className={classes.orderItemsContainer}>Order Items</div>
            <div className={classes.orderStatusContainer}>
                <span className={classes.orderStatusBadge}>
                    {derivedStatus}
                </span>
                <OrderProgressBar status={derivedStatus} />
            </div>
            <button
                className={classes.contentToggleContainer}
                onClick={handleContentToggle}
                type="button"
            >
                {contentToggleIcon}
            </button>
            <div className={contentClass}>To be completed by PWA-627</div>
        </li>
    );
};

export default OrderRow;
