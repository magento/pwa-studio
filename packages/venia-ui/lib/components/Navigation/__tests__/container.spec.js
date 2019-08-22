import React, { useContext } from 'react';
import { createTestInstance } from '@magento/peregrine';

import Container, {
    AppContext,
    CatalogContext,
    UserContext
} from '../container';
import Navigation from '../navigation';

jest.mock('@magento/venia-drivers', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(Component => ({
            Component: jest.fn(Component),
            mapDispatchToProps,
            mapStateToProps
        }))
    )
}));

jest.mock('../navigation', () => jest.fn(() => <i />));

test('returns a connected Container component', () => {
    const { mapDispatchToProps, mapStateToProps } = Container;

    expect(mapStateToProps).toBeInstanceOf(Function);
    expect(mapDispatchToProps).toEqual({
        closeDrawer: expect.any(Function),
        createAccount: expect.any(Function),
        getUserDetails: expect.any(Function),
        signOut: expect.any(Function),
        updateCategories: expect.any(Function)
    });
});

test('mapStateToProps maps state to props', () => {
    const { mapStateToProps } = Container;
    const include = {
        app: 'a',
        catalog: 'b',
        user: 'c'
    };
    const exclude = { foo: 'd' };
    const state = { ...include, ...exclude };

    expect(mapStateToProps(state)).toEqual(include);
});

test('renders correctly', () => {
    const { Component } = Container;
    const { root } = createTestInstance(<Component />);

    expect(root.findByType(Navigation)).toBeTruthy();
});

test('provides several contexts', () => {
    const { Component } = Container;
    const log = jest.fn();
    const props = {
        app: 'app',
        catalog: 'catalog',
        closeDrawer: jest.fn(),
        createAccount: jest.fn(),
        getUserDetails: jest.fn(),
        signOut: jest.fn(),
        updateCategories: jest.fn(),
        user: 'user'
    };

    Navigation.mockImplementationOnce(() => {
        const [appState, appApi] = useContext(AppContext);
        const [catalogState, catalogApi] = useContext(CatalogContext);
        const [userState, userApi] = useContext(UserContext);

        log({
            appState,
            appApi,
            catalogState,
            catalogApi,
            userState,
            userApi
        });

        return <i />;
    });

    createTestInstance(<Component {...props} />);

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
            appState: props.app,
            appApi: expect.objectContaining({
                closeDrawer: props.closeDrawer
            }),
            catalogState: props.catalog,
            catalogApi: expect.objectContaining({
                updateCategories: props.updateCategories
            }),
            userState: props.user,
            userApi: expect.objectContaining({
                createAccount: props.createAccount,
                getUserDetails: props.getUserDetails,
                signOut: props.signOut
            })
        })
    );
});
