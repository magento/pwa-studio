import { connect } from '@magento/venia-drivers';
import { toggleDrawer } from '../../actions/app';
import Search from './search';
import catalogActions from '../../actions/catalog';
import { executeSearch, toggleSearch } from '../../actions/app';

const mapStateToProps = ({ app }) => {
    const { searchOpen } = app;

    return { searchOpen };
};

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(toggleDrawer('filter')),
    filterClear: () => dispatch(catalogActions.filterOption.clear()),
    executeSearch: (query, history, categoryId) =>
        dispatch(executeSearch(query, history, categoryId)),
    toggleSearch: () => dispatch(toggleSearch())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
