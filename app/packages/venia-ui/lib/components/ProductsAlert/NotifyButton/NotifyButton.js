import React from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './NotifyButton.module.css';
import { useStyle } from '../../../classify';
import { FormattedMessage, useIntl } from 'react-intl';

const NotifyButton = props => {
    const { handleOpendStockModal } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const buttonAlertStock = (
        <Button
            // aria-label={formatMessage({
            //     id: 'productAlert.Notify me',
            //     defaultMessage: 'Notify me'
            // })}
            className={classes.root}
            // disabled={isDisabled}
            onPress={handleOpendStockModal}
            priority="high"
            type="button"
        >
            <span className={classes.text}>
                <FormattedMessage id="productAlert.Notify me" defaultMessage="Notify me" />
            </span>
        </Button>
    );

    return <div>{buttonAlertStock}</div>;
};

export default NotifyButton;
