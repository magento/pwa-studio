import { connect } from 'react-redux';
import { resetCheckout } from 'src/actions/checkout';
import actions from './actions';
import Receipt from './receipt';
import { getOrderInformation } from './selectors';

const { reset } = actions;

export default connect(
    state => ({ order: getOrderInformation(state) }),
    { resetCheckout, reset }
)(Receipt);
