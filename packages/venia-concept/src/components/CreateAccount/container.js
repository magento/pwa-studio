import { connect } from 'react-redux';
import CreateAccount from './createAccount';
import { createAccount } from 'src/actions/user';

const mapStateToProps = ({ user }) => {
    const { createAccountError } = user;
    return {
        createAccountError
    };
};

export default connect(
    mapStateToProps,
    null
)(CreateAccount);
