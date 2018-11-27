import { connect } from 'react-redux';
import MyAccount from './myAccount';
import { getCurrentUser, getAccountAddressList } from 'src/selectors/user';

export default connect(state => ({
    user: getCurrentUser(state),
    addresses: getAccountAddressList(state)
}))(MyAccount);
