import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import HeaderContextProvider, { useHeaderContext } from '../header';

const log = jest.fn();
const Consumer = jest.fn(() => {
    const contextValue = useHeaderContext();

    const [{ headerRef }] = contextValue;

    useEffect(() => {
        log(contextValue);
    }, [contextValue]);

    return <i ref={headerRef} />;
});

test('renders children', () => {
    const symbol = Symbol();
    const tree = createTestInstance(
        <HeaderContextProvider>
            <i symbol={symbol} />
        </HeaderContextProvider>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('provides state and actions via context', () => {
    createTestInstance(
        <HeaderContextProvider>
            <Consumer />
        </HeaderContextProvider>
    );

    expect(log.mock.calls[0]).toMatchSnapshot();
});
