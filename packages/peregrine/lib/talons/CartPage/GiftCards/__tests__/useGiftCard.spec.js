import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useGiftCard } from '../useGiftCard';
import { act } from 'react-test-renderer';

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

const removeGiftCard = jest.fn();
const props = {
    code: 'unit test',
    removeGiftCard
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

test('it calls removeGiftCard() with the correct value', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    const { removeGiftCardWithCode } = log.mock.calls[0][0];

    act(() => {
        removeGiftCardWithCode();
    });

    expect(removeGiftCard).toHaveBeenCalledWith(props.code);
});
