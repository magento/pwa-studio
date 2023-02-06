import React from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './NotifyButton.module.css';
import { useStyle } from '../../../classify';
import { FormattedMessage } from 'react-intl';
import inStock from './icons/inStock.svg';
import outOfStock from './icons/outOfStock.svg';
import Tippy from '@tippyjs/react';

const NotifyButton = props => {
    const { handleOpendStockModal, productStatus } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const iconB2B =
        productStatus === 'IN_STOCK' ? (
            <div className={classes.inStockContainer}>
                <img src={inStock} alt="inStock" />
            </div>
        ) : (
            <Tippy
                content={
                    <ul className={classes.list}>
                        <FormattedMessage
                            id="productAlert.NotifyAvailability"
                            defaultMessage="Notify me for this product availability"
                        />
                    </ul>
                }
            >
                <div className={classes.outStockContainer} onClick={handleOpendStockModal}>
                    <img src={outOfStock} alt="outOfStock" />
                </div>
            </Tippy>
        );

    const buttonAlertStock = (
        <Button className={classes.root} onPress={handleOpendStockModal} priority="high" type="button">
            <span className={classes.text}>
                <FormattedMessage id="productAlert.NotifyMe" defaultMessage="Notify me" />
            </span>
        </Button>
    );

    return <div>{process.env.IS_B2B === 'true' ? iconB2B : buttonAlertStock}</div>;
};

export default NotifyButton;
