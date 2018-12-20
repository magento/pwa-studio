import { connect } from 'react-redux';
import { createAccount } from 'src/actions/createAccountPage';
import CreateAccountPage from './createAccountPage';

export default connect(
    null,
    { createAccount }
)(CreateAccountPage);
