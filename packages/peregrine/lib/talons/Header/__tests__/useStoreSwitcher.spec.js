import React from 'react';
import { useHistory } from 'react-router-dom';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useStoreSwitcher } from '../useStoreSwitcher';
import { mockSetItem } from '../../../util/simplePersistence';

jest.mock('../../../util/simplePersistence');

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({}))
}));

const history = {
    go: jest.fn()
};

useHistory.mockImplementation(() => history);

jest.mock('@magento/peregrine', () => ({
    ...jest.requireActual('@magento/peregrine'),
    Util: {
        BrowserPersistence: function() {
            return {
                getItem: jest.fn().mockReturnValueOnce('store2')
            };
        }
    }
}));

jest.mock('@apollo/client', () => {
    const useQuery = jest.fn().mockReturnValue({
        data: {
            storeConfig: {
                code: 'store2',
                store_name: 'Store 2'
            },
            availableStores: [
                {
                    code: 'store1',
                    locale: 'locale1',
                    store_name: 'Store 1',
                    default_display_currency_code: 'USD'
                },
                {
                    code: 'store2',
                    locale: 'locale2',
                    store_name: 'Store 2',
                    default_display_currency_code: 'EUR'
                }
            ]
        },
        error: null,
        loading: false
    });
    return { useQuery };
});

jest.mock('@magento/peregrine/lib/hooks/useDropdown', () => ({
    useDropdown: jest.fn().mockReturnValue({
        elementRef: 'elementRef',
        expanded: false,
        setExpanded: jest.fn(),
        triggerRef: jest.fn()
    })
}));

const defaultProps = {
    queries: {
        getStoreConfigData: 'getStoreConfigData',
        getAvailableStoresData: 'getAvailableStoresData'
    }
};

const Component = props => {
    const talonProps = useStoreSwitcher(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

test('should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

describe('event handlers', () => {
    const { talonProps } = getTalonProps(defaultProps);

    test('handleSwitchStore switches store view', () => {
        const { handleSwitchStore } = talonProps;
        handleSwitchStore('store1');

        expect(mockSetItem.mock.calls).toEqual([
            ['store_view_code', 'store1'],
            ['store_view_currency', 'USD']
        ]);
        expect(history.go).toHaveBeenCalledTimes(1);
    });

    test('handleSwitchStore does nothing when switching to not existing store', () => {
        const { handleSwitchStore } = talonProps;
        handleSwitchStore('store404');

        expect(mockSetItem).toHaveBeenCalledTimes(0);
        expect(history.go).toHaveBeenCalledTimes(0);
    });
});

test('includes store code when option is enabled and no store code is present in URL', () => {
    process.env.USE_STORE_CODE_IN_URL = 'true';

    const originalLocation = window.location;
    delete window.location;
    window.location = {
        pathname: '/',
        assign: jest.fn()
    };

    const { talonProps } = getTalonProps(defaultProps);
    const { handleSwitchStore } = talonProps;

    handleSwitchStore('store1');

    expect(window.location.assign).toBeCalledWith('/store1');

    process.env.USE_STORE_CODE_IN_URL = 'false';
    window.location = originalLocation;
});

test('replaces current store code in URL with new store code', () => {
    process.env.USE_STORE_CODE_IN_URL = 'true';

    const { talonProps } = getTalonProps(defaultProps);
    const { handleSwitchStore } = talonProps;

    const originalLocation = window.location;
    delete window.location;
    window.location = {
        pathname: '/store2/category-name.html',
        assign: jest.fn()
    };

    handleSwitchStore('store1');

    expect(window.location.assign).toBeCalledWith('/store1/category-name.html');

    process.env.USE_STORE_CODE_IN_URL = 'false';
    window.location = originalLocation;
});

test('adds store code to url when not present but store code in url enabled', () => {
    process.env.USE_STORE_CODE_IN_URL = 'true';

    const { talonProps } = getTalonProps(defaultProps);
    const { handleSwitchStore } = talonProps;

    const originalLocation = window.location;
    delete window.location;
    window.location = {
        pathname: '/category/category-name.html',
        assign: jest.fn()
    };

    handleSwitchStore('store1');

    expect(window.location.assign).toBeCalledWith(
        '/store1/category/category-name.html'
    );

    process.env.USE_STORE_CODE_IN_URL = 'false';
    window.location = originalLocation;
});
