import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import Adapter from '@magento/venia-ui/lib/components/Adapter';

// mock components
jest.mock('@apollo/client', () => ({
    ApolloProvider: jest.fn(props => {
        return <i title="ApolloProvider">{props.children}</i>;
    })
}));
jest.mock('react-redux', () => ({
    Provider: jest.fn(props => {
        return <i title="ReduxProvider">{props.children}</i>;
    })
}));
jest.mock('react-router-dom', () => ({
    BrowserRouter: jest.fn(props => {
        return <i title="BrowserRouter">{props.children}</i>;
    })
}));
jest.mock('@magento/peregrine/lib/context/style', () =>
    jest.fn(props => {
        return <i title="StyleContextProvider">{props.children}</i>;
    })
);
jest.mock('@magento/venia-ui/lib/components/App', () => {
    const App = jest.fn(props => {
        return <i title="App">{props.children}</i>;
    });

    App.AppContextProvider = jest.fn(props => {
        return <i title="AppContextProvider">{props.children}</i>;
    });

    return App;
});
jest.mock('@magento/venia-ui/lib/components/StoreCodeRoute', () =>
    jest.fn(props => {
        return <i title="StoreCodeRoute">{props.children}</i>;
    })
);

// mock hooks
jest.mock('@magento/peregrine/lib/talons/Adapter/useAdapter', () => ({
    useAdapter: jest.fn()
}));

const talonProps = {
    apolloProps: {
        client: {}
    },
    initialized: false,
    reduxProps: {
        store: {}
    },
    routerProps: {
        basename: null
    },
    styleProps: {
        initialState: new Set()
    },
    urlHasStoreCode: false
};

useAdapter.mockReturnValue(talonProps);

describe('renders as expected', () => {
    test('when the Apollo client has not initialized yet', () => {
        const wrapper = createTestInstance(<Adapter />);

        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    test('when the URL has a store code', () => {
        useAdapter.mockReturnValueOnce({
            ...talonProps,
            initialized: true,
            routerProps: {
                basename: '/fr'
            },
            urlHasStoreCode: true
        });

        const wrapper = createTestInstance(<Adapter />);

        expect(wrapper.toJSON()).toMatchSnapshot();
    });

    test('when the URL does not have a store code', () => {
        useAdapter.mockReturnValueOnce({
            ...talonProps,
            initialized: true
        });

        const wrapper = createTestInstance(<Adapter />);

        expect(wrapper.toJSON()).toMatchSnapshot();
    });
});
