import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import AuthModal from '../../AuthModal';
import CategoryTree from '../../CategoryTree';
import NavHeader from '../navHeader';
import Navigation from '../navigation';

jest.mock('../../../classify');
jest.mock('../../AuthBar', () => () => <i />);
jest.mock('../../AuthModal', () => () => <i />);
jest.mock('../../CategoryTree', () => () => <i />);
jest.mock('../navHeader', () => () => <i />);

jest.mock('@magento/peregrine/lib/context/app', () => {
    const closeDrawer = jest.fn();
    const useAppContext = jest.fn(() => [
        { drawer: 'nav' },
        {
            actions: {},
            closeDrawer
        }
    ]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/catalog', () => {
    const updateCategories = jest.fn();
    const useCatalogContext = jest.fn(() => [
        {
            categories: {
                1: { parentId: 0 },
                2: { parentId: 1 }
            },
            rootCategoryId: 1
        },
        {
            actions: { updateCategories }
        }
    ]);

    return { useCatalogContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const getUserDetails = jest.fn();
    const useUserContext = jest.fn(() => [{}, { getUserDetails }]);

    return { useUserContext };
});

test('renders correctly when open', () => {
    const instance = createTestInstance(<Navigation />);

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findByProps({ className: 'root_open' })).toBeTruthy();
});

test('renders correctly when closed', () => {
    useAppContext.mockImplementationOnce(() => [
        { drawer: null },
        { closeDrawer: jest.fn() }
    ]);

    const instance = createTestInstance(<Navigation />);

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findByProps({ className: 'root' })).toBeTruthy();
});

test('getUserDetails() is called on mount', () => {
    const { getUserDetails } = useUserContext()[1];

    createTestInstance(<Navigation />);

    expect(getUserDetails).toHaveBeenCalledTimes(1);
});

test('showCreateAccount updates the view', () => {
    const { root } = createTestInstance(<Navigation />);
    const { showCreateAccount } = root.findByType(AuthModal).props;

    act(() => {
        showCreateAccount();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('CREATE_ACCOUNT');
});

test('showForgotPassword updates the view', () => {
    const { root } = createTestInstance(<Navigation />);
    const { showForgotPassword } = root.findByType(AuthModal).props;

    act(() => {
        showForgotPassword();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('FORGOT_PASSWORD');
});

test('showMainMenu updates the view', () => {
    const { root } = createTestInstance(<Navigation />);
    const { showMainMenu } = root.findByType(AuthModal).props;

    act(() => {
        showMainMenu();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('MENU');
});

test('showMyAccount updates the view', () => {
    const { root } = createTestInstance(<Navigation />);
    const { showMyAccount } = root.findByType(AuthModal).props;

    act(() => {
        showMyAccount();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('MY_ACCOUNT');
});

test('showSignIn updates the view', () => {
    const { root } = createTestInstance(<Navigation />);
    const { showSignIn } = root.findByType(AuthModal).props;

    act(() => {
        showSignIn();
    });

    const header = root.findByType(NavHeader);

    expect(header.props.view).toBe('SIGN_IN');
});

test('back button closes the drawer', () => {
    const { closeDrawer } = useAppContext()[1];
    const { root } = createTestInstance(<Navigation />);
    const { onBack: handleBack } = root.findByType(NavHeader).props;

    act(() => {
        handleBack();
    });

    expect(closeDrawer).toHaveBeenCalledTimes(1);
});

test('back button returns from MyAccount to menu', () => {
    const { root } = createTestInstance(<Navigation />);
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
    const { root } = createTestInstance(<Navigation />);
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
    const { root } = createTestInstance(<Navigation />);
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
    const { root } = createTestInstance(<Navigation />);
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
    const { root } = createTestInstance(<Navigation />);
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
