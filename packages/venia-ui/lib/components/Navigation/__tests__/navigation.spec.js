import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import AuthModal from '../../AuthModal';
import CategoryTree from '../../CategoryTree';
import { AppContext, CatalogContext, UserContext } from '../container';
import NavHeader from '../navHeader';
import Navigation from '../navigation';

jest.mock('../../../classify');
jest.mock('../../AuthBar', () => () => <i />);
jest.mock('../../AuthModal', () => () => <i />);
jest.mock('../../CategoryTree', () => () => <i />);
jest.mock('../navHeader', () => () => <i />);

const mockAppContext = [{ drawer: 'nav' }, { closeDrawer: jest.fn() }];

const mockCatalogContext = [
    {
        categories: {
            1: { parentId: 0 },
            2: { parentId: 1 }
        },
        rootCategoryId: 1
    },
    { updateCategories: jest.fn() }
];

const mockUserContext = [{}, { getUserDetails: jest.fn() }];

jest.mock('../container', () => {
    const { createContext } = require('react');

    return {
        AppContext: createContext(),
        CatalogContext: createContext(),
        UserContext: createContext()
    };
});

const MockContext = props => (
    <AppContext.Provider value={mockAppContext}>
        <UserContext.Provider value={mockUserContext}>
            <CatalogContext.Provider value={mockCatalogContext}>
                {props.children}
            </CatalogContext.Provider>
        </UserContext.Provider>
    </AppContext.Provider>
);

test('renders correctly when open', () => {
    const instance = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findByProps({ className: 'root_open' })).toBeTruthy();
});

test('renders correctly when closed', () => {
    const [appState, appApi] = mockAppContext;
    const updatedMock = [{ ...appState, drawer: null }, appApi];

    const instance = createTestInstance(
        <MockContext>
            <AppContext.Provider value={updatedMock}>
                <Navigation />
            </AppContext.Provider>
        </MockContext>
    );

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findByProps({ className: 'root' })).toBeTruthy();
});

test('getUserDetails() is called on mount', () => {
    const { getUserDetails } = mockUserContext[1];

    createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );

    expect(getUserDetails).toHaveBeenCalledTimes(1);
});

test('showCreateAccount updates the view', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { showCreateAccount } = root.findByType(AuthModal).props;

    act(() => {
        showCreateAccount();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('CREATE_ACCOUNT');
});

test('showForgotPassword updates the view', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { showForgotPassword } = root.findByType(AuthModal).props;

    act(() => {
        showForgotPassword();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('FORGOT_PASSWORD');
});

test('showMyAccount updates the view', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { showMyAccount } = root.findByType(AuthModal).props;

    act(() => {
        showMyAccount();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('MY_ACCOUNT');
});

test('showSignIn updates the view', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { showSignIn } = root.findByType(AuthModal).props;

    act(() => {
        showSignIn();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('SIGN_IN');
});

/*
const ancestors = {
    CREATE_ACCOUNT: 'SIGN_IN',
    FORGOT_PASSWORD: 'SIGN_IN',
    MY_ACCOUNT: 'MENU',
    SIGN_IN: 'MENU',
    MENU: null
};
*/

test('back button closes the drawer', () => {
    const { closeDrawer } = mockAppContext[1];
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { onBack: handleBack } = root.findByType(NavHeader).props;

    act(() => {
        handleBack();
    });

    expect(closeDrawer).toHaveBeenCalledTimes(1);
});

test('back button returns from MyAccount to menu', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { showMyAccount } = root.findByType(AuthModal).props;

    act(() => {
        showMyAccount();
    });

    act(() => {
        const { onBack: handleBack } = root.findByType(NavHeader).props;

        handleBack();
    });

    expect(root.findByType(AuthModal).props.view).toBe('MENU');
});

test('back button returns from SignIn to menu', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { showSignIn } = root.findByType(AuthModal).props;

    act(() => {
        showSignIn();
    });

    act(() => {
        const { onBack: handleBack } = root.findByType(NavHeader).props;

        handleBack();
    });

    expect(root.findByType(AuthModal).props.view).toBe('MENU');
});

test('back button returns from CreateAccount to SignIn', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { showCreateAccount } = root.findByType(AuthModal).props;

    act(() => {
        showCreateAccount();
    });

    act(() => {
        const { onBack: handleBack } = root.findByType(NavHeader).props;

        handleBack();
    });

    expect(root.findByType(AuthModal).props.view).toBe('SIGN_IN');
});

test('back button returns from ForgotPassword to SignIn', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { showForgotPassword } = root.findByType(AuthModal).props;

    act(() => {
        showForgotPassword();
    });

    act(() => {
        const { onBack: handleBack } = root.findByType(NavHeader).props;

        handleBack();
    });

    expect(root.findByType(AuthModal).props.view).toBe('SIGN_IN');
});

test('back button returns to the parent category', () => {
    const { root } = createTestInstance(
        <MockContext>
            <Navigation />
        </MockContext>
    );
    const { setCategoryId } = root.findByType(CategoryTree).props;

    act(() => {
        setCategoryId(2);
    });

    expect(root.findByType(CategoryTree).props.categoryId).toBe(2);

    act(() => {
        const { onBack: handleBack } = root.findByType(NavHeader).props;

        handleBack();
    });

    expect(root.findByType(CategoryTree).props.categoryId).toBe(1);
});
