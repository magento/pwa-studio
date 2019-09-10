import { resetPassword } from '@magento/peregrine/lib/store/actions/user';
import { connect } from '../../drivers';
import ForgotPassword from './forgotPassword';

const mapStateToProps = ({ user }) => {
    const { isResettingPassword, resetPasswordError } = user;

    return {
        error: resetPasswordError,
        isResettingPassword
    };
};

const mapDispatchToProps = {
    resetPassword
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPassword);
