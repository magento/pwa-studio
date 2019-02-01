import { connect } from 'src/drivers';
import { createAccount } from 'src/actions/createAccountPage';
import CreateAccountPage from './createAccountPage';

export default connect(
    null,
    { createAccount }
)(CreateAccountPage);
