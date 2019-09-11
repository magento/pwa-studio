import { connect, withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';
import actions from '@magento/peregrine/lib/store/actions/checkoutReceipt';
import Receipt from './receipt';
import { getOrderInformation } from '@magento/peregrine/lib/store/selectors/checkoutReceipt';

const { reset } = actions;

const mapStateToProps = state => ({
    order: getOrderInformation(state)
});

const mapDispatchToProps = {
    reset
};

/**
 * TODO:
 *  - checkoutReceipt state can be folded into checkout
 *  - getOrderInformation is not a necessary selector. The component should
 *    pull off what it needs. As of 9/11/19 it is not even using order state.
 *  - reset action should clear previous order state after a CTA is clicked.
 *  - withRouter should be "hookified" to useHistory or useRouter.
 */
export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Receipt);
