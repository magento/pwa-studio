import { connect } from '@magento/venia-drivers';

import Flow from './flow';

const mapStateToProps = ({ cart, checkout, user }) => ({
    cart,
    checkout,
    user
});

export default connect(mapStateToProps)(Flow);
