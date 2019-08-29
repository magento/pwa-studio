import { connect } from '@magento/venia-drivers';
import CreateAccount from './createAccount';

const mapStateToProps = ({ user }) => {
    const { createAccountError, isCreatingAccount, isSignedIn } = user;
    return {
        hasError: !!createAccountError,
        isCreatingAccount,
        isSignedIn
    };
};

export default connect(mapStateToProps)(CreateAccount);
