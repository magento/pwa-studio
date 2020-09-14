import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import createTestInstance from '../../../util/createTestInstance';
import { useOrderRow } from '../useOrderRow';

const log = jest.fn();
const Component = props => {
    const talonProps = useOrderRow({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

test('returns correct shape', () => {
    createTestInstance(<Component />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
});

test('callback toggles open state', () => {
    createTestInstance(<Component />);

    const talonProps = log.mock.calls[0][0];

    act(() => {
        talonProps.handleContentToggle();
    });

    const newTalonProps = log.mock.calls[1][0];

    expect(talonProps.isOpen).toBe(false);
    expect(newTalonProps.isOpen).toBe(true);
});
