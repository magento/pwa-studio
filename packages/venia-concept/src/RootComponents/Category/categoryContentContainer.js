import { connect } from 'src/drivers';
import { toggleDrawer } from 'src/actions/app';
import CategoryContent from './categoryContent';

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(toggleDrawer('filter'))
});

export default connect(
    null,
    mapDispatchToProps
)(CategoryContent);
