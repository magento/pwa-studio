import { connect } from 'react-redux';
import CreateAccountPage from './createAccountPage';
import { createAccount } from './asyncActions';

export default connect(
    null,
    { createAccount }
)(CreateAccountPage);
