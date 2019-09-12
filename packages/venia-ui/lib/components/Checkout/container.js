import { connect } from '@magento/venia-drivers';

import Flow from './flow';

const mapStateToProps = ({ directory }) => ({
    directory
});

export default connect(mapStateToProps)(Flow);
