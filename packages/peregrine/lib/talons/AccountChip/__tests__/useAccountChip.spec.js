import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useQuery } from '@apollo/client';

import { useAccountChip } from '../useAccountChip';

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: true
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn().mockReturnValue({
        data: {
            customer: {
                id: null
            }
        },
        error: null,
        loading: false
    })
}));

const log = jest.fn();

const Component = props => {
    const talonProps = useAccountChip(props);
    log(talonProps);

    return <i />;
};

const mockProps = {
    queries: {
        getCustomerDetailsQuery: 'getCustomerDetailsQuery'
    }
};

test('return correct shape while data is loading', () => {
    useQuery.mockReturnValueOnce({
        loading: true
    });

    createTestInstance(<Component {...mockProps} />);
    const talonProps = log.mock.calls[0][0];
    expect(talonProps).toMatchSnapshot();
});

it('returns the correct shape', () => {
    // Act.
    createTestInstance(<Component {...mockProps} />);

    // Assert.
    const result = log.mock.calls[0][0];
    expect(Object.keys(result)).toEqual([
        'currentUser',
        'isLoadingUserName',
        'isUserSignedIn'
    ]);
});
