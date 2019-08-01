import { connect } from '@magento/venia-drivers';

import {
    beginCheckout,
    cancelCheckout,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingAddress,
    submitShippingMethod
} from '../../actions/checkout';

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
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingAddress,
    submitShippingMethod
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Flow);
