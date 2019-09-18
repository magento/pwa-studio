import { connect } from '@magento/venia-drivers';

import {
    beginCheckout,
    cancelCheckout,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingAddress,
    submitShippingMethod
} from '@magento/peregrine/lib/store/actions/checkout';

import Flow from './flow';

const mapStateToProps = ({ cart, checkout, user }) => ({
    cart,
    checkout,
    user
});

const mapDispatchToProps = {
    beginCheckout,
    cancelCheckout,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingAddress,
    submitShippingMethod
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Flow);
