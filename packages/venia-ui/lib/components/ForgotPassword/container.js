import { resetPassword } from '../../actions/user';
import { connect } from '../../drivers';
import ForgotPassword from './forgotPassword';

const mapStateToProps = ({ user }) => {
    const { resetPasswordError } = user;

    return {
        error: resetPasswordError
    };
};

const mapDispatchToProps = {
    resetPassword
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPassword);
