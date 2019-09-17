import { connect, withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';
import {
    createAccount,
    resetReceipt
} from '@magento/peregrine/lib/store/actions/checkout';
import Receipt from './receipt';

const mapStateToProps = ({ app, checkout }) => {
    return {
        drawer: app.drawer,
        order: checkout.receipt.order
    };
};

const mapDispatchToProps = {
    createAccount,
    reset: resetReceipt
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Receipt);
