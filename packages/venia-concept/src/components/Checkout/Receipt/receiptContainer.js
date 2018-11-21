import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import actions from 'src/actions/checkoutReceipt';
import { continueShopping } from 'src/actions/checkout';
import Receipt from './receipt';
import { getOrderInformation } from 'src/selectors/checkoutReceipt';

const { reset } = actions;

// TODO: add create account handler
export default compose(
    connect(
        state => ({ order: getOrderInformation(state) }),
        { continueShopping, reset }
    ),
    withRouter
)(Receipt);
