import React from 'react';
import { act } from 'react-test-renderer';

import createTestInstance from '../../../util/createTestInstance';
import { useWishlist } from '../useWishlist';

const Component = () => {
    const talonProps = useWishlist();

    return <i talonProps={talonProps} />;
};

test('returns correct shape', () => {
    const { root } = createTestInstance(<Component />);
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
