import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { closeDrawer } from 'src/actions/app';
import Page from './page';

const mapStateToProps = ({ app }) => ({ app });
const mapDispatchToProps = { closeDrawer };

// We need withRouter HOC here because of this issue https://reacttraining.com/react-router/core/guides/redux-integration/blocked-updates
export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Page);
