import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useApplyButton } from '../useApplyButton';

/*
 *  Member variables.
 */

const log = jest.fn();
const Component = props => {
    const talonProps = useApplyButton({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    handleApplyCard: jest.fn()
};

/*
 *  Tests.
 */

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        handleApplyCardWithCode: expect.any(Function)
    });
});
