import { connect } from '@magento/venia-drivers';
import { getUserInformation } from '../../../selectors/user';
import MyAccountMenuTrigger from './myAccountMenuTrigger';

export default connect(state => ({
    user: getUserInformation(state)
}))(MyAccountMenuTrigger);
