import { connect } from 'react-redux';
import { compose } from 'redux';
import FilterModal from './filterModal';
import { closeDrawer } from 'src/actions/app';
import { addFilter, removeFilter } from 'src/actions/catalog';

const mapStateToProps = ({ app }) => {
    return {
        drawer: app.drawer
    };
};

const mapDispatchToProps = {
    closeDrawer,
    addFilter,
    removeFilter
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(FilterModal);
