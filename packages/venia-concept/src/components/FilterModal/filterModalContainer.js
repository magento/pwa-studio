import { connect } from 'react-redux';
import { compose } from 'redux';
import FilterModal from './filterModal';
import catalogActions from 'src/actions/catalog';
import { withRouter } from 'react-router-dom';

const mapDispatchToProps = {
    filterAdd: catalogActions.filterOption.add,
    filterRemove: catalogActions.filterOption.remove
};

export default compose(
    withRouter,
    connect(
        null,
        mapDispatchToProps
    )
)(FilterModal);
