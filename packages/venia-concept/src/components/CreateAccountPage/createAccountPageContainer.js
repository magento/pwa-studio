import { connect } from 'react-redux';
import CreateAccountPage from './createAccountPage';
import { handleCreateAccount } from './asyncActions';

export default connect(null, { handleCreateAccount })(CreateAccountPage);
