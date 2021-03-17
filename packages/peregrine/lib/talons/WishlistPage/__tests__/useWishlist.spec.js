import React from 'react';
import { act } from 'react-test-renderer';

import createTestInstance from '../../../util/createTestInstance';
import { useWishlist } from '../useWishlist';

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useMutation: jest.fn(() => [
            jest.fn(),
            {
                error: false,
                loading: false
            }
        ])
    };
});

const Component = props => {
    const talonProps = useWishlist({ ...props });

    return <i talonProps={talonProps} />;
};

const baseProps = {
    id: '5',
    mutations: { updateWishlistMutation: 'updateWishlistMutation' }
};

test('returns correct shape', () => {
    const { root } = createTestInstance(<Component {...baseProps} />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('toggles open state', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleContentToggle();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[1].handleContentToggle();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].isOpen).toBe(true);
    expect(talonPropsResult[1].isOpen).toBe(false);
    expect(talonPropsResult[2].isOpen).toBe(true);
});
