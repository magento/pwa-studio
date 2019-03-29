import { connect } from 'react-redux';
import { compose } from 'redux';
import FilterModal from './filterModal';
import { addFilter, removeFilter } from 'src/actions/catalog';

const mapDispatchToProps = {
    addFilter,
    removeFilter
};

export default compose(
    connect(
        null,
        mapDispatchToProps
    )
)(FilterModal);
