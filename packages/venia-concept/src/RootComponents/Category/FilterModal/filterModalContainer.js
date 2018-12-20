import { connect } from 'react-redux';
import FilterModal from './filterModal';
import catalogActions from 'src/actions/catalog';

const mapStateToProps = ({ catalog }) => {
    const { chosenFilterOptions } = catalog;
    return {
        chosenFilterOptions
    };
};

const mapDispatchToProps = {
    updateChosenFilterOptions: catalogActions.updateChosenFilterOptions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterModal);
