import { connect } from 'react-redux';
import FilterModal from './filterModal';
import catalogActions from 'src/actions/catalog';

const mapDispatchToProps = {
    filterAdd: catalogActions.filterOption.add,
    filterRemove: catalogActions.filterOption.remove,
    filterClear: catalogActions.filterOption.clear
};

export default connect(
    null,
    mapDispatchToProps
)(FilterModal);
