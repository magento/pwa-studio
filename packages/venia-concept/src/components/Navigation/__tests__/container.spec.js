import { closeDrawer } from 'src/actions/app';
import catalogActions from 'src/actions/catalog';
import { createAccount, getUserDetails } from 'src/actions/user';
import Container from '../container';
import Navigation from '../navigation';

jest.mock('src/drivers', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(component => ({
            component,
            mapStateToProps,
            mapDispatchToProps
        }))
    ),
    withRouter: component => {
        component.defaultProps = {
            ...component.defaultProps,
            router: { pathname: 'mocked-path' }
        };
        return component;
    }
}));
jest.mock('src/actions/app');
jest.mock('src/actions/catalog');
jest.mock('src/actions/user');
jest.mock('../navigation');

const { updateCategories } = catalogActions;

test('returns a connected Navigation component', () => {
    expect(Container.component).toBe(Navigation);
    expect(Container.mapStateToProps).toBeInstanceOf(Function);
    expect(Container.mapDispatchToProps).toMatchObject({
        closeDrawer,
        createAccount,
        getUserDetails,
        updateCategories
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
            isSignedIn: 'isSignedIn'
        },
        extra: 'extra'
    };

    const props = mapStateToProps(state);

    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        categories: state.catalog.categories,
        isSignedIn: state.user.isSignedIn,
        rootCategoryId: state.catalog.rootCategoryId,
        user: {
            email: state.user.currentUser.email,
            firstname: state.user.currentUser.firstname,
            lastname: state.user.currentUser.lastname
        }
    });
});
