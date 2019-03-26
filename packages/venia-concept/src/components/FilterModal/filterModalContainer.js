import { connect } from 'react-redux';
import { compose } from 'redux';
import FilterModal from './filterModal';
import { filterAdd, filterRemove } from 'src/actions/catalog';
import { withRouter } from 'react-router-dom';

const mapDispatchToProps = {
    filterAdd,
    filterRemove
};

export default compose(
    withRouter,
    connect(
        null,
        mapDispatchToProps
    )
)(FilterModal);
