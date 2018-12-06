import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import actions from 'src/actions/checkoutReceipt';
import { continueShopping, createAccount } from 'src/actions/checkout';
import Receipt from './receipt';
import { getOrderInformation } from 'src/selectors/checkoutReceipt';

const { reset } = actions;

export default compose(
    withRouter,
    connect(
        state => ({ order: getOrderInformation(state) }),
        { continueShopping, createAccount, reset }
    )
)(Receipt);
