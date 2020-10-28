import React from 'react';
import { useHistory } from 'react-router-dom';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useCurrencySwitcher } from '../useCurrencySwitcher';
import { mockSetItem } from '../../../util/simplePersistence';

jest.mock('../../../util/simplePersistence');
jest.mock('../../../hooks/useTypePolicies', () => ({
    useTypePolicies: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({}))
}));

const history = {
    go: jest.fn()
};

useHistory.mockImplementation(() => history);

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    const useQueryMock = jest.fn().mockReturnValue({
        data: {
            currency: {
                current_currency_code: 'GBP',
                default_display_currency_code: 'EUR',
                available_currency_codes: ['USD', 'EUR', 'GBP']
            }
        },
        error: null,
        loading: false
    });

    return {
        ...apolloClient,
        useQuery: useQueryMock
    };
});

jest.mock('@magento/peregrine/lib/hooks/useDropdown', () => ({
    useDropdown: jest.fn().mockReturnValue({
        elementRef: 'elementRef',
        expanded: false,
        setExpanded: jest.fn(),
        triggerRef: jest.fn()
    })
}));

const defaultProps = {};

const Component = props => {
    const talonProps = useCurrencySwitcher(props);

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

    test('handleSwitchCurrency switches currency', () => {
        const { handleSwitchCurrency } = talonProps;
        handleSwitchCurrency('EUR');

        expect(mockSetItem.mock.calls).toEqual([
            ['store_view_currency', 'EUR']
        ]);
        expect(history.go).toHaveBeenCalledTimes(1);
    });

    test('handleSwitchCurrency does nothing when switching to not existing currency', () => {
        const { handleSwitchCurrency } = talonProps;
        handleSwitchCurrency('404');

        expect(mockSetItem).toHaveBeenCalledTimes(0);
        expect(history.go).toHaveBeenCalledTimes(0);
    });
});
