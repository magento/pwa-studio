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
    return <div>{isOpen}</div>;
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
        handleSectionToggle: expect.any(Function),
        openSectionIds: expect.any(Set)
    });
});
