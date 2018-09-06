import { connect } from 'react-redux';

import { closeDrawer } from 'src/actions/app';
import { getAllCategories } from 'src/actions/catalog';
import Navigation from './navigation';

const mapStateToProps = ({ catalog }) => {
    const { categories, rootCategoryId } = catalog;

    return { categories, rootCategoryId };
};

const mapDispatchToProps = { closeDrawer, getAllCategories };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
