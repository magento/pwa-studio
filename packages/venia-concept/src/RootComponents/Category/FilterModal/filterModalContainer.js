import { connect } from 'react-redux';
import FilterModal from './filterModal';
import catalogActions from 'src/actions/catalog';
import catalog from '../../../reducers/catalog';

console.log('CATALOG ACTIONS', catalogActions);

const mapDispatchToProps = {
    filterAdd: catalogActions.filterOption.add,
    filterRemove: catalogActions.filterOption.remove,
    filterClear: catalogActions.filterOption.clear
};

export default connect(
    null,
    mapDispatchToProps
)(FilterModal);
