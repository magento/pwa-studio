import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import { useNavigation } from '../useNavigation';

/*
 * Mocks.
 */
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

jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest
        .fn()
        .mockResolvedValue({ data: { customer: {} } });

    return { useAwaitQuery };
});

/*
 * Members.
 */

const log = jest.fn();
const Component = props => {
    const talonProps = useNavigation({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {};

/*
 * Tests.
 */

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        catalogActions: expect.any(Object),
        categories: expect.any(Object),
        categoryId: expect.any(Number),
        handleBack: expect.any(Function),
        handleClose: expect.any(Function),
        hasModal: expect.any(Boolean),
        isOpen: expect.any(Boolean),
        isTopLevel: expect.any(Boolean),
        setCategoryId: expect.any(Function),
        showCreateAccount: expect.any(Function),
        showForgotPassword: expect.any(Function),
        showMainMenu: expect.any(Function),
        showMyAccount: expect.any(Function),
        showSignIn: expect.any(Function),
        view: expect.any(String)
    });
});

describe('handleBack (back button)', () => {
    test('closes the drawer when view is MENU', () => {
        // Arrange.
        const { closeDrawer } = useAppContext()[1];

        // Act.
        createTestInstance(<Component {...props} />);

        const talonProps = log.mock.calls[0][0];
        const { handleBack } = talonProps;

        act(() => {
            handleBack();
        });

        // Assert.
        expect(closeDrawer).toHaveBeenCalledTimes(1);
    });

    test('returns from MyAccount to menu', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        let talonProps = log.mock.calls[0][0];
        const { showMyAccount } = talonProps;

        act(() => {
            showMyAccount();
        });
        act(() => {
            talonProps = log.mock.calls[1][0];
            const { handleBack } = talonProps;
            handleBack();
        });

        // Assert.
        talonProps = log.mock.calls[2][0];
        const { view } = talonProps;
        expect(view).toBe('MENU');
    });

    test('returns from SignIn to menu', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        let talonProps = log.mock.calls[0][0];
        const { showSignIn } = talonProps;

        act(() => {
            showSignIn();
        });
        act(() => {
            talonProps = log.mock.calls[1][0];
            const { handleBack } = talonProps;
            handleBack();
        });

        // Assert.
        talonProps = log.mock.calls[2][0];
        const { view } = talonProps;
        expect(view).toBe('MENU');
    });

    test('returns from CreateAccount to SignIn', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        let talonProps = log.mock.calls[0][0];
        const { showCreateAccount } = talonProps;

        act(() => {
            showCreateAccount();
        });
        act(() => {
            talonProps = log.mock.calls[1][0];
            const { handleBack } = talonProps;
            handleBack();
        });

        // Assert.
        talonProps = log.mock.calls[2][0];
        const { view } = talonProps;
        expect(view).toBe('SIGN_IN');
    });

    test('returns from ForgotPassword to SignIn', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        let talonProps = log.mock.calls[0][0];
        const { showForgotPassword } = talonProps;

        act(() => {
            showForgotPassword();
        });
        act(() => {
            talonProps = log.mock.calls[1][0];
            const { handleBack } = talonProps;
            handleBack();
        });

        // Assert.
        talonProps = log.mock.calls[2][0];
        const { view } = talonProps;
        expect(view).toBe('SIGN_IN');
    });

    test('returns to the parent category', () => {
        // Act.
        createTestInstance(<Component {...props} />);

        let talonProps = log.mock.calls[0][0];
        const { setCategoryId } = talonProps;

        act(() => {
            setCategoryId(2);
        });
        act(() => {
            talonProps = log.mock.calls[1][0];
            const { handleBack } = talonProps;
            handleBack();
        });

        // Assert.
        talonProps = log.mock.calls[2][0];
        const { categoryId } = talonProps;
        expect(categoryId).toBe(1);
    });
});
