import { connect } from '@magento/venia-drivers';
import { createAccount } from '../../actions/user';
import CreateAccountPage from './createAccountPage';

export default connect(
    null,
    { createAccount }
)(CreateAccountPage);
