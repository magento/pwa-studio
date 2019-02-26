import { connect } from 'src/drivers';
import { getUserInformation } from 'src/selectors/user';
import MyAccountMenuTrigger from './myAccountMenuTrigger';

export default connect(state => ({
    user: getUserInformation(state)
}))(MyAccountMenuTrigger);
