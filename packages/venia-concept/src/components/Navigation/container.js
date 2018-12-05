import { connect } from 'react-redux';
import { getUserDetails } from 'src/actions/user';
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

const mapDispatchToProps = { getUserDetails, closeDrawer, getAllCategories };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
