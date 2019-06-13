import { connect } from 'src/drivers';

import {
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
} from 'src/actions/checkout';

import Flow from './flow';

const mapStateToProps = ({ cart, checkout, directory, user }) => ({
    cart,
    checkout,
    directory,
    user
});

const mapDispatchToProps = {
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Flow);
