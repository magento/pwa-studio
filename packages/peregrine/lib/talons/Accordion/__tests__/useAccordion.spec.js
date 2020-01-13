import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useAccordion } from '../useAccordion';

const log = jest.fn();
const Component = props => {
    const talonProps = useAccordion({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};
const SectionChild = props => {
    const { isOpen } = props;
    return <div>{isOpen}</div>
};

test('it returns the proper shape', () => {
    // Arrange.
    const props = {
        canOpenMultiple: true,
        children: [<SectionChild isOpen={false} />]
    };

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        controlledChildren: expect.any(Array)
    });
});

test('children get sent additional props', () => {
    // Arrange.
    const props = {
        canOpenMultiple: true,
        children: [<SectionChild isOpen={false} />]
    };

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const { controlledChildren } = talonProps;
    const controlledChild = controlledChildren[0];

    expect(controlledChild.props).toHaveProperty('handleClick');
    expect(controlledChild.props).toHaveProperty('index');
    expect(controlledChild.props).toHaveProperty('isOpen');
});
