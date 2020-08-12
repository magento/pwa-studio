import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';
import { useScrollIntoView } from '../useScrollIntoView';

const Component = props => {
    const { theRef, theThing } = props;
    useScrollIntoView(theRef, theThing);
    return <i />;
};

it('should scroll', () => {
    const ref = {
        current: {
            scrollIntoView: jest.fn()
        }
    };

    const props = {
        theRef: ref,
        theThing: false
    };

    const instance = createTestInstance(<Component {...props} />);

    expect(ref.current.scrollIntoView).toHaveBeenCalledTimes(0);

    props.theThing = true;

    act(() => {
        instance.update(<Component {...props} />);
    });

    expect(ref.current.scrollIntoView).toHaveBeenCalledTimes(1);
});
