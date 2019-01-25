import { connect } from 'react-redux';
import FilterModal from './filterModal';
import catalogActions from 'src/actions/catalog';

const mapDispatchToProps = {
    filterSet: catalogActions.filterOption.set,
    filterAdd: catalogActions.filterOption.add,
    filterRemove: catalogActions.filterOption.remove
};

export default connect(
    null,
    mapDispatchToProps
)(FilterModal);
