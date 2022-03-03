import React from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayOf, number, shape, string } from 'prop-types';

import {
    useStockStatus,
    // LOW_STOCK,
    OUT_OF_STOCK
} from '@magento/peregrine/lib/talons/StockStatusMessage';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './stockStatus.module.css';

const StockStatus = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { stockStatus } = useStockStatus({ ...props });

    const message =
        stockStatus === OUT_OF_STOCK ? (
            <FormattedMessage
                id={'stockStatus.outOfStock'}
                defaultMessage={'This item is currently out of stock'}
            />
        ) : // This will be used for low stock property
        // ) : stockStatus === LOW_STOCK ? (
        //     <FormattedMessage
        //         id={'stockStatus.lowStock'}
        //         defaultMessage={'Only a few left in stock'}
        //     />
        null;

    return message ? <div className={classes.root}>{message}</div> : null;
};

export default StockStatus;

StockStatus.propTypes = {
    classes: shape({
        root: string
    }),
    item: shape({
        only_x_left_in_stock: number,
        stock_status: string.isRequired,
        variants: arrayOf(
            shape({
                product: shape({
                    only_x_left_in_stock: number,
                    stock_status: string.isRequired
                })
            })
        )
    }).isRequired
};
