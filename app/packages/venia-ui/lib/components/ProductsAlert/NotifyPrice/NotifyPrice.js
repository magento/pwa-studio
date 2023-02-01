import React from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './NotifyPrice.module.css';
import { useStyle } from '../../../classify';
import { FormattedMessage, useIntl } from 'react-intl';

const NotifyPrice = props => {
    const { handleOpendStockModal } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const buttonAlertPrice = (
        <Button className={classes.root} onPress={handleOpendStockModal} type="button">
            <span className={classes.textButton}>
                <FormattedMessage id="productAlert.NotifyPrice" defaultMessage="Notify me when the price drops" />
            </span>
        </Button>
    );

    return <div>{buttonAlertPrice}</div>;
};

export default NotifyPrice;
