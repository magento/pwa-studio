import { connect } from 'react-redux';
import FiltersCurrent from './filtersCurrent';
import { filterRemove } from 'src/actions/catalog';

const mapStateToProps = ({ catalog }) => {
    const { chosenFilterOptions } = catalog;
    return {
        chosenFilterOptions
    };
};

const mapDispatchToProps = {
    filterRemove
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FiltersCurrent);
