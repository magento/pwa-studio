import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import { useSubMenu } from '@magento/peregrine/lib/talons/MegaMenu/useSubMenu';

const Component = props => {
    const talonProps = useSubMenu(props);

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

const defaultProps = {
    isFocused: true,
    subMenuState: true,
    handleCloseSubMenu: jest.fn()
};

test('Should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('onKeyDown event called', () => {
    const event = {
        key: 'Tab',
        shiftKey: false,
        target: {
            addEventListener: jest.fn((onKeyDown, handleCloseSubMenu) => {
                map[onKeyDown] = handleCloseSubMenu;
            })
        },
        stopPropagation: jest.fn()
    };

    const map = {};
    const props = {
        ...defaultProps
    };
    const { talonProps } = getTalonProps(props);

    talonProps.keyboardProps.onKeyDown(event);

    expect(talonProps.isSubMenuActive).toEqual(true);
});
