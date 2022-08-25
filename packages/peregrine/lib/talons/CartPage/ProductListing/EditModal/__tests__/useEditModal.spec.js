import { useAppContext } from '../../../../../context/app';
import { useEditModal } from '../useEditModal';

import React from 'react';
import createTestInstance from '../../../../../util/createTestInstance';

jest.mock('../../../../../context/app', () => ({
    useAppContext: jest.fn()
}));

const Component = props => {
    const talonProps = useEditModal(props);
    return <i talonProps={talonProps} />;
};

test('returns correct shape', () => {
    const closeDrawer = jest.fn().mockName('closeDrawer');
    useAppContext.mockReturnValueOnce([{ drawer: null }, { closeDrawer }]);

    const tree = createTestInstance(<Component />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});
