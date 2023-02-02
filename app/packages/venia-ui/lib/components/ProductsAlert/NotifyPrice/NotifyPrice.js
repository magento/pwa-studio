import React from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './NotifyPrice.module.css';
import { useStyle } from '../../../classify';
import { FormattedMessage } from 'react-intl';
import { Bell } from 'react-feather';
import Icon from '../../Icon';
import Tippy from '@tippyjs/react';

const NotifyPrice = props => {
    const { handleOpendStockModal } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const iconB2B = (
        <Tippy
            content={
                <ul className={classes.list}>
                    <FormattedMessage id="productAlert.NotifyPrice" defaultMessage="Notify me when the price drops" />
                </ul>
            }
        >
            <div className={classes.iconContainer} onClick={handleOpendStockModal}>
                <Icon src={Bell} size={14} />
            </div>
        </Tippy>
    );

    const buttonAlertPrice = (
        <Button className={classes.root} onPress={handleOpendStockModal} type="button">
            <span className={classes.textButton}>
                <FormattedMessage id="productAlert.NotifyPrice" defaultMessage="Notify me when the price drops" />
            </span>
        </Button>
    );

    return <div>{process.env.IS_B2B === 'true' ? iconB2B : buttonAlertPrice}</div>;
};

export default NotifyPrice;
