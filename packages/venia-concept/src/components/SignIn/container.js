import { connect } from 'src/drivers';
import SignIn from './signIn';
import { signIn } from 'src/actions/user';

const mapStateToProps = ({ user }) => {
    const { signInError } = user;
    return {
        signInError
    };
};

const mapDispatchToProps = { signIn };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);
