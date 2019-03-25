import { connect } from 'src/drivers';

import { completePasswordReset, resetPassword } from 'src/actions/user';
import ForgotPassword from './forgotPassword';

const mapStateToProps = ({ user }) => {
    const { email, isInProgress } = user.forgotPassword;

    return { email, isInProgress };
};

const mapDispatchToProps = {
    completePasswordReset,
    resetPassword
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPassword);
