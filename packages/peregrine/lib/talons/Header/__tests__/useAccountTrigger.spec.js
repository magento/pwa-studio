import React from 'react';

import { useAccountTrigger } from '../useAccountTrigger';
import createTestInstance from '../../../util/createTestInstance';

jest.mock('@magento/peregrine/lib/hooks/useDropdown', () => ({
    useDropdown: jest.fn().mockReturnValue({
        elementRef: 'elementRef',
        expanded: false,
        setExpanded: jest.fn(),
        triggerRef: jest.fn()
    })
}));

const defaultProps = {
    VIEWS: {
        SIGNIN: 'SIGNIN',
        FORGOT_PASSWORD: 'FORGOT_PASSWORD',
        CREATE_ACCOUNT: 'CREATE_ACCOUNT',
        ACCOUNT: 'ACCOUNT'
    },
    mutations: {
        signOut: 'signOutMutation'
    }
};

const Component = props => {
    const talonProps = useAccountTrigger(props);

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

test('should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});
