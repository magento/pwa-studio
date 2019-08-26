import { connect } from '@magento/venia-drivers';
import SignIn from './signIn';
import { signIn } from '../../actions/user';

const mapStateToProps = ({ user }) => {
    const { signInError, getDetailsError } = user;

    return {
        // Either error signifies a problem.
        hasError: !!signInError || !!getDetailsError
    };
};

const mapDispatchToProps = { signIn };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);
