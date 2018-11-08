import { connect } from 'react-redux';

import { closeDrawer } from 'src/actions/app';
import AppShell from './appShell';

const mapStateToProps = ({ app }) => ({ app });
const mapDispatchToProps = { closeDrawer };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppShell);
