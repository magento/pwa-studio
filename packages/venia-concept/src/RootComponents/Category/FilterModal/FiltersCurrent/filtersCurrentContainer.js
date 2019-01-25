import { connect } from 'react-redux';
import FiltersCurrent from './FiltersCurrent';
import catalogActions from 'src/actions/catalog';

const mapStateToProps = ({ catalog }) => {
    const { chosenFilterOptions } = catalog;
    return {
        chosenFilterOptions
    };
};

const mapDispatchToProps = {
    filterRemove: catalogActions.filterOption.remove
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FiltersCurrent);
