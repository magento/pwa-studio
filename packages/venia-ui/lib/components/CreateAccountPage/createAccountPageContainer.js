import { connect } from '@magento/venia-drivers';
import { createAccount } from '@magento/peregrine/lib/store/actions/createAccountPage';
import CreateAccountPage from './createAccountPage';

export default connect(
    null,
    { createAccount }
)(CreateAccountPage);
