import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useGiftCard } from '../useGiftCard';

/*
 *  Member variables.
 */

const log = jest.fn();
const Component = props => {
    const talonProps = useGiftCard({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    code: 'unit test',
    removeGiftCard: jest.fn()
};

/*
 *  Tests.
 */

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        removeGiftCardWithCode: expect.any(Function)
    });
});
