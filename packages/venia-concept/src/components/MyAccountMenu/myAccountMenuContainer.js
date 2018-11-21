import { connect } from 'react-redux';
import { signOut } from 'src/actions/user';
import MyAccountMenu from './myAccountMenu';

export default connect(
    null,
    { signOut }
)(MyAccountMenu);
