import { connect } from '@magento/venia-drivers';
import CreateAccount from './createAccount';

const mapStateToProps = ({ user }) => {
    const { createAccountError,isSignedIn } = user;
    return {
        createAccountError,
        isSignedIn
    };
};

export default connect(mapStateToProps)(CreateAccount);
