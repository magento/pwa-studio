import React, { useEffect } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useHeader } from '../useHeader';
import { createTestInstance } from '../../../index';
import { act } from 'react-test-renderer';

jest.mock('@magento/peregrine/lib/context/app', () => {
    const api = {};
    const state = {};
    return {
        useAppContext: jest.fn(() => [state, api])
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

    expect(log).toHaveBeenCalledWith({
        handleSearchTriggerClick: expect.any(Function),
        hasBeenOffline: false,
        isOnline: true,
        isPageLoading: false
    });
});
