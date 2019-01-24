import { connect } from 'react-redux';
import FiltersCurrent from './filtersCurrent';
import catalogActions from 'src/actions/catalog';

const mapStateToProps = ({ catalog }) => {
    const { chosenFilterOptions } = catalog;
    return {
        chosenFilterOptions
    };
};

const mapDispatchToProps = {
    filterAdd: catalogActions.filterOptionAdd,
    filterRemove: catalogActions.filterOptionRemove,
    filterClear: catalogActions.filterOptionClear
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FiltersCurrent);
