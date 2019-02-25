import { connect } from 'src/drivers';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import actions from 'src/actions/checkoutReceipt';
import { continueShopping, createAccount } from 'src/actions/checkout';
import Receipt from './receipt';
import { getOrderInformation } from 'src/selectors/checkoutReceipt';

const { reset } = actions;

const mapStateToProps = state => ({
    order: getOrderInformation(state)
});

const mapDispatchToProps = {
    continueShopping,
    createAccount,
    reset
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Receipt);
