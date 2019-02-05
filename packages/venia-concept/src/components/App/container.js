import { connect } from 'src/drivers';

import appActions, { closeDrawer } from 'src/actions/app';
import App from './app';

const mapStateToProps = ({ app, unhandledErrors }) => ({
    app,
    unhandledErrors
});
const { markErrorHandled } = appActions;
const mapDispatchToProps = { closeDrawer, markErrorHandled };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
