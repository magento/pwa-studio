import { connect } from 'react-redux';
import FiltersCurrent from './filtersCurrent';
import { removeFilter } from '@magento/peregrine/lib/store/actions/catalog';

const mapStateToProps = ({ catalog }) => {
    const { chosenFilterOptions } = catalog;
    return {
        chosenFilterOptions
    };
};

const mapDispatchToProps = {
    removeFilter
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FiltersCurrent);
