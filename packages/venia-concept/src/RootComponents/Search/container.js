import { connect } from 'src/drivers';
import { toggleDrawer } from 'src/actions/app';
import Search from './search';
import { executeSearch, toggleSearch } from 'src/actions/app';

const mapStateToProps = ({ app }) => {
    const { searchOpen } = app;

    return { searchOpen };
};

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(toggleDrawer('filter')),
    executeSearch: () => dispatch(executeSearch()),
    toggleSearch: () => dispatch(toggleSearch())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
