import { connect } from 'src/drivers';
import SignIn from './signIn';
import { signIn } from 'src/actions/user';

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
