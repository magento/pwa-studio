import { connect } from 'react-redux';
import CreateAccount from './createAccount';
import { createAccount } from 'src/actions/user';

const mapStateToProps = ({ user }) => {
    const { createAccountError } = user;
    return {
        createAccountError
    };
};

const mapDispatchToProps = { createAccount };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount);
