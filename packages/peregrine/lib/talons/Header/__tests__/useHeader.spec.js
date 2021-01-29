import React, { useEffect } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useHeader } from '../useHeader';
import { createTestInstance } from '../../../index';

jest.mock('@magento/peregrine/lib/context/app', () => {
    const api = {};
    const state = {};
    return {
        useAppContext: jest.fn(() => [state, api])
    };
});
jest.mock('react-router-dom', () => {
    return {
        useLocation: jest.fn(() => ({
            pathname: '/unit_test_pathname'
        }))
    };
});

const log = jest.fn();
const Component = () => {
    const talonProps = useHeader();

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return <div {...talonProps} id={'header'} />;
};

test('it returns the correct shape', () => {
    // Act.
    createTestInstance(<Component />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const actualKeys = Object.keys(talonProps);
    const expectedKeys = [
        'handleSearchTriggerClick',
        'hasBeenOffline',
        'isOnline',
        'isPageLoading',
        'isSearchOpen',
        'searchRef',
        'searchTriggerRef'
    ];
    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
});

test('useHeader returns correct values from useAppContext', () => {
    useAppContext.mockImplementation(() => {
        return [
            {
                hasBeenOffline: false,
                isOnline: true,
                isPageLoading: false
            },
            {}
        ];
    });

    createTestInstance(<Component />);

    const talonProps = log.mock.calls[0][0];
    const { hasBeenOffline, isOnline, isPageLoading } = talonProps;
    expect(hasBeenOffline).toBe(false);
    expect(isOnline).toBe(true);
    expect(isPageLoading).toBe(false);
});
