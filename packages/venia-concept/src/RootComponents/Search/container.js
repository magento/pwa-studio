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
    executeSearch: (query, history, categoryId) =>
        dispatch(executeSearch(query, history, categoryId)),
    toggleSearch: () => dispatch(toggleSearch())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
