import { connect } from '@magento/venia-drivers';

import {
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
} from '../../actions/checkout';

import Flow from './flow';

const mapStateToProps = ({ cart, checkout, user }) => ({
    cart,
    checkout,
    user
});

const mapDispatchToProps = {
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Flow);
