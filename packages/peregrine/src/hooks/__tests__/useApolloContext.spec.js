import React from 'react';
import { ApolloContext } from 'react-apollo/ApolloContext';

import { useApolloContext } from '../useApolloContext';
import createTestInstance from '../../util/createTestInstance';

const log = jest.fn();

const Component = () => {
    const hookProps = useApolloContext();

    log(hookProps);

    return <i />;
};

test('returns an Apollo client', () => {
    const query = jest.fn(async () => ({}));

    createTestInstance(
        <ApolloContext.Provider value={{ query }}>
            <Component />
        </ApolloContext.Provider>
    );

    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenNthCalledWith(1, { query });
});
