import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './paymentMethod.module.css';
import Price from '@magento/venia-ui/lib/components/Price';
import PaymentIcon from './Icons/payment.svg'
const PaymentMethod = props => {
    const { data, total, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    /**
     * There can be multiple payment methods for an order but
     * since Venia does not support multiple payment methods yet
     * we are picking the first method in the array.
     */
    const [{ name }] = data;
    console.log(props, 'PaymentMethodPaymentMethod');

    return (
        <div className={classes.root} data-cy="OrderDetails-PaymentMethod-root">
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.paymentMethodLabel"
                    defaultMessage="Payment Method"
                />
            </div>
            <div className={classes.payment_type}>
                <div>
                    {name}
                    <span>
                        Total price:&nbsp;
                        <Price
                            value={total?.grand_total.value}
                            currencyCode={total?.grand_total.currency}
                        />
                    </span>
                </div>
                <div>
                    <span className={classes.boxInfo}>
                        <img src={PaymentIcon} alt='PaymentIcon'/>
                        Safetly payment</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;

PaymentMethod.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        payment_type: string
    }),
    data: arrayOf(
        shape({
            name: string
        })
    )
};
