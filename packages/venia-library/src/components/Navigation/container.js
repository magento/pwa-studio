import { connect } from 'src/drivers';
import { closeDrawer } from 'src/actions/app';
import { getAllCategories } from 'src/actions/catalog';
import {
    completePasswordReset,
    createAccount,
    getUserDetails,
    resetPassword
} from 'src/actions/user';
import Navigation from './navigation';

const mapStateToProps = ({ catalog, user }) => {
    const { categories, rootCategoryId } = catalog;
    const { currentUser, isSignedIn, forgotPassword } = user;
    const { firstname, email, lastname } = currentUser;

    return {
        categories,
        email,
        firstname,
        forgotPassword,
        isSignedIn,
        lastname,
        rootCategoryId
    };
};

const mapDispatchToProps = {
    closeDrawer,
    completePasswordReset,
    createAccount,
    getAllCategories,
    getUserDetails,
    resetPassword
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
