import { connect } from 'src/drivers';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { signOut } from 'src/actions/user';
import { getUserInformation } from 'src/selectors/user';
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
