import React from 'react';

import createTestInstance from '../../../util/createTestInstance';
import { useCreateWishlist } from '../useCreateWishlist';

const Component = props => {
    const talonProps = useCreateWishlist(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

test('should return properly', () => {
    const { talonProps } = getTalonProps();

    expect(talonProps).toMatchSnapshot();
});

test('handleShowModal should set isModalOpen to true', () => {
    const { talonProps, update } = getTalonProps();

    talonProps.handleShowModal();
    const { isModalOpen } = update();

    expect(isModalOpen).toBeTruthy();
});

test('handleHideModal should set isModalOpen to false', () => {
    const { talonProps, update } = getTalonProps();

    talonProps.handleHideModal();
    const { isModalOpen } = update();

    expect(isModalOpen).toBeFalsy();
});

test('handleCreateList should set isModalOpen to false', () => {
    const { talonProps, update } = getTalonProps();

    talonProps.handleCreateList();
    const { isModalOpen } = update();

    expect(isModalOpen).toBeFalsy();
});
