import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { resetCheckout } from 'src/actions/checkout';
import actions from './actions';
import { handleCreateAccount } from './asyncActions';
import Receipt from './receipt';
import { getOrderInformation } from './selectors';

const { reset } = actions;

export default compose(
    connect(
        state => ({ order: getOrderInformation(state) }),
        { resetCheckout, reset, handleCreateAccount }
    ),
    withRouter
)(Receipt);
