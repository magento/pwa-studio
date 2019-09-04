import {
    completePasswordReset,
    resetPassword
} from '@magento/peregrine/lib/store/actions/user';
import { connect } from '../../drivers';
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
