import { connect } from 'react-redux';

import { closeDrawer } from 'src/actions/app';
import { getAllCategories } from 'src/actions/catalog';
import Navigation from './navigation';

const mapStateToProps = ({ catalog, user }) => {
    const { categories, rootCategoryId } = catalog;
    const { firstname, email, isSignedIn, lastname } = user;

    return {
        categories,
        firstname,
        email,
        isSignedIn,
        lastname,
        rootCategoryId
    };
};

const mapDispatchToProps = { closeDrawer, getAllCategories };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
