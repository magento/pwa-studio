import React from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './NotifyButton.module.css';
import { useStyle } from '../../../classify';
import { FormattedMessage } from 'react-intl';

const NotifyButton = props => {
    const { handleOpendStockModal, disabled } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const buttonAlertStock = (
        <Button
            className={classes.root}
            onPress={handleOpendStockModal}
            priority="high"
            type="button"
            disabled={disabled}
        >
            <span className={classes.text}>
                <FormattedMessage id="productAlert.NotifyMe" defaultMessage="Notify me" />
            </span>
        </Button>
    );

    return <div>{buttonAlertStock}</div>;
};

export default NotifyButton;
