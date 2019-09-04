import { connect } from '@magento/venia-drivers';
import SignIn from './signIn';
import { signIn } from '@magento/peregrine/lib/store/actions/user';

const mapStateToProps = ({ user }) => {
    const {
        isGettingDetails,
        isSigningIn,
        signInError,
        getDetailsError
    } = user;

    return {
        // Either error signifies a problem.
        hasError: !!signInError || !!getDetailsError,
        isSigningIn: isGettingDetails || isSigningIn
    };
};

const mapDispatchToProps = { signIn };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);
