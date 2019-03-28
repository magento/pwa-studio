import { connect } from 'react-redux';
import { compose } from 'redux';
import FilterModal from './filterModal';
import { filterAdd, filterRemove } from 'src/actions/catalog';

const mapDispatchToProps = {
    filterAdd,
    filterRemove
};

export default compose(
    connect(
        null,
        mapDispatchToProps
    )
)(FilterModal);
