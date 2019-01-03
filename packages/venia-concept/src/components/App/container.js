import { connect } from 'react-redux';

import { closeDrawer } from 'src/actions/app';
import App from './app';

const mapStateToProps = ({ app }) => ({ app });
const mapDispatchToProps = { closeDrawer };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
