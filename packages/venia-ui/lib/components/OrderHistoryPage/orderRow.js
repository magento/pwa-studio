import React from 'react';
import { object, shape, string } from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Price } from '@magento/peregrine';
import { useOrderRow } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import CollapsedImageGallery from './collapsedImageGallery';
import OrderProgressBar from './orderProgressBar';
import defaultClasses from './orderRow.css';

const OrderRow = props => {
    const { order } = props;
    const {
        invoices,
        items,
        number: orderNumber,
        order_date: orderDate,
        shipments,
        status,
        total
    } = order;
    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;

    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = orderDate.replace(' ', 'T');
    const formattedDate = new Date(isoFormattedDate).toLocaleDateString(
        undefined,
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
    const collapsedImageGalleryElement = isOpen ? null : (
        <CollapsedImageGallery items={items} />
    );

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
            <div className={classes.orderItemsContainer}>
                {collapsedImageGalleryElement}
            </div>
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

OrderRow.propTypes = {
    classes: shape({
        root: string,
        cell: string,
        stackedCell: string,
        label: string,
        value: string,
        orderNumberContainer: string,
        orderDateContainer: string,
        orderTotalContainer: string,
        orderStatusContainer: string,
        orderItemsContainer: string,
        contentToggleContainer: string,
        orderNumberLabel: string,
        orderDateLabel: string,
        orderTotalLabel: string,
        orderNumber: string,
        orderDate: string,
        orderTotal: string,
        orderStatusBadge: string,
        content: string,
        content_collapsed: string
    }),
    order: object.isRequired
};
