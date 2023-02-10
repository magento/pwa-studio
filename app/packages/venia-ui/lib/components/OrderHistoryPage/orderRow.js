import React from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '../Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import OrderDetails from './OrderDetails';
import OrderIncidencesModal from '../Csr/OrderIncidencesModal';
import OrderProgressBar from './orderProgressBar';
import Price from '@magento/venia-ui/lib/components/Price';
import ReOrderBtn from './ReOrderBtn';

import { useOrderRow } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow';
import { useStyle } from '../../classify';

import defaultClasses from './orderRow.module.css';
import reOrderBtnClasses from './ReOrderBtn/reOrderBtn.module.css';

import { IncidenceIcon } from '@magento/venia-ui/lib/assets/incidenceIcon';
import { useModulesContext } from '@magento/peregrine/lib/context/modulesProvider';



const OrderRow = props => {
    const { order, config, address, setSuccessToast, setErrorToast } = props;
    const { formatMessage } = useIntl();
    const { invoices, items, number: orderNumber, order_date: orderDate, shipments, status, total } = order;

    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;

    const { tenantConfig } = useModulesContext();

    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = orderDate.replace(' ', 'T');
    const formattedDate = new Date(isoFormattedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const hasInvoice = !!invoices.length;
    const hasShipment = !!shipments.length;
    let derivedStatus;
    if (status === 'Complete') {
        derivedStatus = formatMessage({
            id: 'orderRow.deliveredText',
            defaultMessage: 'Delivered'
        });
    } else if (status === 'Canceled') {
        derivedStatus = formatMessage({
            id: 'orderRow.canceled',
            defaultMessage: 'Canceled'
        });
    } else if (hasShipment) {
        derivedStatus = formatMessage({
            id: 'orderRow.shippedText',
            defaultMessage: 'Shipped'
        });
    } else if (hasInvoice) {
        derivedStatus = formatMessage({
            id: 'orderRow.readyToShipText',
            defaultMessage: 'Ready to ship'
        });
    } else {
        derivedStatus = formatMessage({
            id: 'orderRow.processingText',
            defaultMessage: 'Processing'
        });
    }

    const talonProps = useOrderRow({ items });
    const {
        handleContentToggle,
        imagesData,
        isOpen,
        loading,
        openOrderIncidenceModal,
        setTicketModal,
        ticketModal
    } = talonProps;
    const image = imagesData[Object.keys(imagesData)[0]];
    const classes = useStyle(defaultClasses, props.classes, reOrderBtnClasses);

    const contentClass = isOpen ? classes.content : classes.content_collapsed;

    const contentToggleIconSrc = isOpen ? ChevronUp : ChevronDown;

    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={24} />;

    const orderDetails = loading ? null : (
        <OrderDetails config={config} address={address} orderData={order} imagesData={imagesData} />
    );

    const orderTotalPrice =
        currency && orderTotal !== null ? <Price currencyCode={currency} value={orderTotal} /> : '-';

    const thumbnailProps = {
        alt: 'orderDetail',
        width: 75
    };
    const thumbnailElement = image?.thumbnail ? <Image {...thumbnailProps} resource={image.thumbnail.url} /> : <></>;

    return (
        <li className={[classes.root, classes.reOrderRow].join(' ')}>
            <div className={classes.imageWrapper}>{thumbnailElement}</div>
            <div className={[classes.orderNumberContainer, classes.sideBorder].join(' ')}>
                <span className={classes.orderNumberLabel}>
                    <FormattedMessage id={'orderRow.orderNumber'} defaultMessage={'Order number'} />
                </span>
                <span className={classes.orderNumber}>{orderNumber}</span>
            </div>
            <div className={[classes.orderNumberContainer, classes.sideBorder].join(' ')}>
                <span className={classes.orderDateLabel}>
                    <FormattedMessage id={'orderRow.orderDateText'} defaultMessage={'Order Date'} />
                </span>
                <span className={classes.orderDate}>{formattedDate}</span>
            </div>
            <div className={classes.orderNumberContainer}>
                <span className={classes.orderTotalLabel}>
                    <FormattedMessage id={'orderRow.orderTotalText'} defaultMessage={'Order Total'} />
                </span>
                <div className={classes.orderTotal}>{orderTotalPrice}</div>
            </div>

            <div className={[classes.orderNumberContainer, classes.orderReOrderContainer].join(' ')}>
                <ReOrderBtn orderNumber={orderNumber} order={order} config={config} />
            </div>

            <div className={[classes.orderStatusContainer, classes.orderReStatusContainer].join(' ')}>
                <span className={classes.orderStatusBadge}>{derivedStatus}</span>
                <OrderProgressBar status={derivedStatus} />
                {tenantConfig.csrEnabled && (
                    <div className={classes.orderIncidenciesButtonContainer}>
                        <Button
                            onClick={() => {
                                openOrderIncidenceModal(orderNumber, formattedDate, orderTotalPrice, derivedStatus);
                            }}
                            type="button"
                            id={'orderIncidence' + orderNumber}
                            className={classes.orderInsurancesButton}
                        >
                            <IncidenceIcon />
                            <FormattedMessage id={'orderRow.openIncident'} defaultMessage={'Open incident'} />
                        </Button>
                    </div>
                )}
            </div>
            <button className={classes.contentToggleContainer} onClick={handleContentToggle} type="button">
                {contentToggleIcon}
            </button>
            <div className={contentClass}>{orderDetails}</div>
            {tenantConfig.csrEnabled && (
                <OrderIncidencesModal
                    isOpen={ticketModal}
                    setTicketModal={setTicketModal}
                    orderNumber={orderNumber}
                    orderDate={formattedDate}
                    orderTotal={orderTotalPrice}
                    orderStatus={derivedStatus}
                    imagesData={imagesData}
                    setErrorToast={setErrorToast}
                    setSuccessToast={setSuccessToast}
                />
            )}
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
    order: shape({
        billing_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string)
        }),
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        invoices: arrayOf(
            shape({
                id: string
            })
        ),
        number: string,
        order_date: string,
        payment_methods: arrayOf(
            shape({
                type: string,
                additional_data: arrayOf(
                    shape({
                        name: string,
                        value: string
                    })
                )
            })
        ),
        shipping_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string),
            telephone: string
        }),
        shipping_method: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        number: string
                    })
                )
            })
        ),
        status: string,
        total: shape({
            discounts: arrayOf(
                shape({
                    amount: shape({
                        currency: string,
                        value: number
                    })
                })
            ),
            grand_total: shape({
                currency: string,
                value: number
            }),
            subtotal: shape({
                currency: string,
                value: number
            }),
            total_tax: shape({
                currency: string,
                value: number
            }),
            total_shipping: shape({
                currency: string,
                value: number
            })
        })
    })
};
