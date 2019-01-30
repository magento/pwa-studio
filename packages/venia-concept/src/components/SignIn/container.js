import { connect } from 'src/drivers';
import SignIn from './signIn';
import { signIn, assignGuestCartToCustomer } from 'src/actions/user';

const mapStateToProps = ({ user }) => {
    const { signInError } = user;
    return {
        signInError
    };
};

const mapDispatchToProps = { signIn, assignGuestCartToCustomer };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);
