import { closeDrawer } from 'src/actions/app';
import { getAllCategories } from 'src/actions/catalog';
import {
    completePasswordReset,
    createAccount,
    getUserDetails,
    resetPassword
} from 'src/actions/user';
import Container from '../container';
import Navigation from '../navigation';

jest.mock('src/drivers', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(component => ({
            component,
            mapStateToProps,
            mapDispatchToProps
        }))
    )
}));
jest.mock('src/actions/app');
jest.mock('src/actions/catalog');
jest.mock('src/actions/user');
jest.mock('../navigation');

test('returns a connected Navigation component', () => {
    expect(Container.component).toBe(Navigation);
    expect(Container.mapStateToProps).toBeInstanceOf(Function);
    expect(Container.mapDispatchToProps).toMatchObject({
        closeDrawer,
        completePasswordReset,
        createAccount,
        getAllCategories,
        getUserDetails,
        resetPassword
    });
});

test('mapStateToProps correctly maps state to props', () => {
    const { mapStateToProps } = Container;

    const state = {
        catalog: {
            categories: 'categories',
            rootCategoryId: 'rootCategoryId'
        },
        user: {
            currentUser: {
                email: 'email',
                firstname: 'firstname',
                lastname: 'lastname'
            },
            forgotPassword: 'forgotPassword',
            isSignedIn: 'isSignedIn'
        },
        extra: 'extra'
    };

    const props = mapStateToProps(state);

    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        categories: state.catalog.categories,
        rootCategoryId: state.catalog.rootCategoryId,
        email: state.user.currentUser.email,
        firstname: state.user.currentUser.firstname,
        lastname: state.user.currentUser.lastname,
        forgotPassword: state.user.forgotPassword,
        isSignedIn: state.user.isSignedIn
    });
});
