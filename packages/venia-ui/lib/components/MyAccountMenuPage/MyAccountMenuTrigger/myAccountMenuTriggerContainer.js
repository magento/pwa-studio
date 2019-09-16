import { connect } from '@magento/venia-drivers';
import { getUserInformation } from '@magento/peregrine/lib/store/selectors/user';
import MyAccountMenuTrigger from './myAccountMenuTrigger';

export default connect(state => ({
    user: getUserInformation(state)
}))(MyAccountMenuTrigger);
