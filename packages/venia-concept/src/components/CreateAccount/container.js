import { connect } from 'react-redux';
import CreateAccount from './createAccount';

const mapStateToProps = ({ user }) => {
    const { createAccountError } = user;
    return {
        createAccountError
    };
};

export default connect(mapStateToProps)(CreateAccount);
