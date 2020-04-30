import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useResetForm } from '../useResetForm';

const log = jest.fn();
const Component = props => {
    const hookProps = useResetForm({ ...props });

    useEffect(() => {
        log(hookProps);
    }, [hookProps]);

    return null;
};

const props = {
    onClick: jest.fn()
};

/*
 *  Tests.
 */
test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        handleClick: expect.any(Function)
    });
});
