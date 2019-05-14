import { connect } from 'react-redux';
import { compose } from 'redux';
import FilterModal from './filterModal';
import { closeDrawer } from 'src/actions/app';
import catalogActions, { addFilter, removeFilter } from 'src/actions/catalog';

const mapStateToProps = ({ app }) => {
    const { drawer } = app;
    return {
        drawer
    };
};

const mapDispatchToProps = dispatch => ({
    closeDrawer: () => dispatch(closeDrawer()),
    addFilter: payload => dispatch(addFilter(payload)),
    removeFilter: payload => dispatch(removeFilter(payload)),
    setToApplied: () => dispatch(catalogActions.filterOption.setToApplied())
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(FilterModal);
