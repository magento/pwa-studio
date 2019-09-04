import { connect, withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';
import actions from '@magento/peregrine/lib/store/actions/checkoutReceipt';
import { createAccount } from '@magento/peregrine/lib/store/actions/checkout';
import Receipt from './receipt';
import { getOrderInformation } from '@magento/peregrine/lib/store/selectors/checkoutReceipt';

const { reset } = actions;

const mapStateToProps = state => ({
    order: getOrderInformation(state)
});

const mapDispatchToProps = {
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
