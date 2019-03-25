import { connect } from 'src/drivers';
import { closeDrawer } from 'src/actions/app';
import catalogActions from 'src/actions/catalog';
import { createAccount, getUserDetails } from 'src/actions/user';
import Navigation from './navigation';

const { updateCategories } = catalogActions;

const mapStateToProps = ({ catalog, user }) => {
    const { categories, rootCategoryId } = catalog;
    const { currentUser, isSignedIn } = user;

    return {
        categories,
        isSignedIn,
        rootCategoryId,
        user: currentUser
    };
};

const mapDispatchToProps = {
    closeDrawer,
    createAccount,
    getUserDetails,
    updateCategories
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);
