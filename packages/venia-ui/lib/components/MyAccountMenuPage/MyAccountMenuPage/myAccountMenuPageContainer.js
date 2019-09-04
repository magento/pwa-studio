import { connect, withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';
import { signOut } from '@magento/peregrine/lib/store/actions/user';
import { getUserInformation } from '@magento/peregrine/lib/store/selectors/user';
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
