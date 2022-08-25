import React from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';
import { useScrollIntoView } from '../useScrollIntoView';

const Component = props => {
    const { theRef, shouldScroll } = props;
    useScrollIntoView(theRef, shouldScroll);
    return <i />;
};

it('should scroll', () => {
    const node = document.createElement('div');
    node.scrollIntoView = jest.fn();

    const ref = {
        current: node
    };

    const props = {
        theRef: ref,
        shouldScroll: false
    };

    const instance = createTestInstance(<Component {...props} />);

    expect(ref.current.scrollIntoView).toHaveBeenCalledTimes(0);

    props.shouldScroll = true;

    act(() => {
        instance.update(<Component {...props} />);
    });

    expect(ref.current.scrollIntoView).toHaveBeenCalledTimes(1);
});
