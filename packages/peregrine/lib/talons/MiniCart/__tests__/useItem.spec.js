import React from 'react';

import createTestInstance from '../../../util/createTestInstance';
import { useItem } from '../useItem';

const Component = props => {
    const talonProps = useItem(props);

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

test('Should render proper shape', () => {
    const { talonProps } = getTalonProps({
        id: '123',
        handleRemoveItem: jest.fn()
    });

    expect(talonProps).toMatchSnapshot();
});

test('Should set isDeleting to true and call handleRemoveItem when removeItem is called', () => {
    const handleRemoveItem = jest.fn();
    const id = '123';
    const { talonProps, update } = getTalonProps({
        id,
        handleRemoveItem
    });

    talonProps.removeItem();
    const newTalonProps = update();

    expect(newTalonProps.isDeleting).toBeTruthy();
    expect(handleRemoveItem).toHaveBeenCalledWith(id);
});
