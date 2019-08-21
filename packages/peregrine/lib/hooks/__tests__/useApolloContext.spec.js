import React from 'react';
import { ApolloContext } from 'react-apollo';

import { useApolloContext } from '../useApolloContext';
import createTestInstance from '../../util/createTestInstance';

const log = jest.fn();

const Component = () => {
    const client = useApolloContext();

    log(client);

    return <i />;
};

test('returns an Apollo client', () => {
    const query = jest.fn(async () => ({}));
    const client = { query };

    createTestInstance(
        <ApolloContext.Provider value={{ client }}>
            <Component />
        </ApolloContext.Provider>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, { query });
});
