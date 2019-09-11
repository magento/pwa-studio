import { connect, withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';
import { signOut } from '../../../actions/user';
import { getUserInformation } from '../../../selectors/user';
import MyAccountMenuPage from './myAccountMenuPage';

export default compose(
    withRouter,
    connect(
        state => ({
            user: getUserInformation(state)
        }),
        { signOut }
    )
)(MyAccountMenuPage);
