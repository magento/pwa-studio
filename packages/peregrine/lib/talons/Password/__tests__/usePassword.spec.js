import React from 'react';
import { act } from 'react-test-renderer';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import { usePassword } from '../usePassword';

const Component = props => {
    const talonProps = usePassword(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        act(() => {
            tree.update(<Component {...{ ...props, ...newProps }} />);
        });

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

test('should render properly', () => {
    const { talonProps } = getTalonProps();

    expect(talonProps).toMatchSnapshot();
});

test('togglePasswordVisibility should toggle visible value', () => {
    const { talonProps, update } = getTalonProps();

    expect(talonProps.visible).toBeFalsy();

    talonProps.togglePasswordVisibility();

    const newTalonProps = update();

    expect(newTalonProps.visible).toBeTruthy();
});
