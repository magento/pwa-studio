import { connect } from '@magento/venia-drivers';
import { closeDrawer } from '../../actions/app';
import { getAllCategories } from '../../actions/catalog';
import {
    completePasswordReset,
    createAccount,
    getUserDetails,
    resetPassword
} from '../../actions/user';
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
