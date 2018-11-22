import { connect } from 'react-redux';
import { signOut } from 'src/actions/user';
import { getUserInformation } from 'src/selectors/user';
import MyAccountMenuPage from './myAccountMenuPage';

export default connect(
    state => ({
        user: getUserInformation(state)
    }),
    { signOut }
)(MyAccountMenuPage);
