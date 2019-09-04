import { connect } from '@magento/venia-drivers';
import SignIn from './signIn';
import { signIn } from '@magento/peregrine/lib/store/actions/user';

const mapStateToProps = ({ user }) => {
    const { isGettingDetails, isSigningIn, signInError } = user;

    return {
        isGettingDetails,
        isSigningIn,
        signInError
    };
};

const mapDispatchToProps = { signIn };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);
