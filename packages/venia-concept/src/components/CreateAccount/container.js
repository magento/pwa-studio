import { connect } from 'src/drivers';
import CreateAccount from './createAccount';

const mapStateToProps = ({ user }) => {
    const { createAccountError,isSignedIn } = user;
    return {
        createAccountError,
        isSignedIn
    };
};

export default connect(mapStateToProps)(CreateAccount);
