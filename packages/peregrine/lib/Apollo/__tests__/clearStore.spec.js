import React, { useEffect } from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { useApolloClient } from '@apollo/client';
import TestRenderer, { act } from 'react-test-renderer';

import { clearStore } from '../clearStore';

const pause = jest.fn();
const purge = jest.fn(async () => {});
const resume = jest.fn();

const cachePersistor = {
    pause,
    purge,
    resume
};

let clearStoreSpy;

const Component = () => {
    const client = useApolloClient();

    clearStoreSpy = jest.spyOn(client, 'clearStore');

    useEffect(() => {
        const clear = async () => {
            await clearStore(client, cachePersistor);
        };

        clear();
    }, [client]);
    return <i />;
};

test('clear store', async () => {
    expect.assertions(4);
    await act(async () => {
        TestRenderer.create(
            <MockedProvider>
                <Component />
            </MockedProvider>
        );
    });

    expect(pause).toHaveBeenCalledTimes(1);
    expect(purge).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(1);
    expect(clearStoreSpy).toHaveBeenCalledTimes(1);
});
