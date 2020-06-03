import React from 'react';
import { act } from 'react-test-renderer';

import createTestInstance from '../../../../util/createTestInstance';
import { useAddressCard } from '../useAddressCard';

const address = {
    country_code: 'US',
    email: 'fry@planet.express',
    firstname: 'Philip',
    id: 66,
    region: {
        region_id: 22
    }
};
const onEdit = jest.fn();
const onSelection = jest.fn();

const mockProps = {
    address,
    onEdit,
    onSelection
};

const Component = props => {
    const talonProps = useAddressCard(props);
    return <i talonProps={talonProps} />;
};

test('returns correct shape', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns correct value for update animation', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.hasUpdate).toBe(false);

    act(() => {
        tree.update(
            <Component
                {...mockProps}
                address={{ ...address, firstname: 'Bender' }}
            />
        );
    });

    const { talonProps: newTalonProps } = root.findByType('i').props;

    expect(newTalonProps.hasUpdate).toBe(true);
});

describe('event handlers fire callbacks', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    test('handleClick', () => {
        const { handleClick } = talonProps;
        handleClick();
        expect(onSelection).toHaveBeenCalledWith(66);
    });

    test('handleKeyPress', () => {
        const { handleKeyPress } = talonProps;

        handleKeyPress({ key: 'Tab' });
        expect(onSelection).not.toBeCalled();

        handleKeyPress({ key: 'Enter' });
        expect(onSelection).toHaveBeenCalledWith(66);
    });

    test('handleEditAddress', () => {
        const { handleEditAddress } = talonProps;
        handleEditAddress();
        expect(onEdit).toHaveBeenCalled();
        expect(onEdit.mock.calls[0][0]).toMatchSnapshot();
    });
});
