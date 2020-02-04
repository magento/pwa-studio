import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCheckBalanceButton } from '../useCheckBalanceButton';

/*
 *  Member variables.
 */

const log = jest.fn();
const Component = props => {
    const talonProps = useCheckBalanceButton({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    checkGiftCardBalance: jest.fn()
};

/*
 *  Tests.
 */

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        checkGiftCardBalanceWithCode: expect.any(Function)
    });
});
