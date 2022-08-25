import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useAccountMenuItems } from '../useAccountMenuItems';

const log = jest.fn();
const Component = props => {
    const talonProps = useAccountMenuItems(props);

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

it('returns the correct shape', () => {
    // Arrange.
    const props = { onSignOut: jest.fn() };

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const result = log.mock.calls[0][0];
    expect(Object.keys(result)).toEqual(['handleSignOut', 'menuItems']);
});
