import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useQuery } from '@apollo/client';
import useContactLink from '../useContactLink';

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn()
}));

jest.mock('../contactUs.gql', () => ({
    getStoreConfigQuery: 'gql-query'
}));

const log = jest.fn();
const Component = () => {
    const talonProps = useContactLink();

    log(talonProps);

    return null;
};

test('it returns loading state', async () => {
    useQuery.mockImplementation(() => ({
        data: null,
        loading: true
    }));

    await createTestInstance(<Component />);

    expect(log).toHaveBeenCalledWith({
        isEnabled: false,
        isLoading: true
    });
});

test('it returns disabled', async () => {
    useQuery.mockImplementation(() => ({
        data: {
            storeConfig: {
                contact_enabled: false
            }
        },
        loading: false
    }));

    await createTestInstance(<Component />);

    expect(log).toHaveBeenCalledWith({
        isEnabled: false,
        isLoading: false
    });
});

test('it returns enabled', async () => {
    useQuery.mockImplementation(() => ({
        data: {
            storeConfig: {
                contact_enabled: true
            }
        },
        loading: false
    }));

    await createTestInstance(<Component />);

    expect(log).toHaveBeenCalledWith({
        isEnabled: true,
        isLoading: false
    });
});
