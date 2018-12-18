import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { closeDrawer } from 'src/actions/app';
import App from './app';

const mapStateToProps = ({ app }) => ({ app });
const mapDispatchToProps = { closeDrawer };

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(App);
