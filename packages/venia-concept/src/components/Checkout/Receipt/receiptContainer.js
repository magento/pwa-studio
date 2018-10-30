import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import actions, { handleContinueShopping } from 'src/actions/checkoutReceipt';
import Receipt from './receipt';
import { getOrderInformation } from 'src/selectors/checkoutReceipt';

const { reset } = actions;

// TODO: add create account handler
export default compose(
    connect(
        state => ({ order: getOrderInformation(state) }),
        { handleContinueShopping, reset }
    ),
    withRouter
)(Receipt);
