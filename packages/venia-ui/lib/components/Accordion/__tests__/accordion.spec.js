import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Accordion from '../accordion';
import Section from '../section';

test('it renders a closed Section correctly', () => {
    // Act.
    const instance = createTestInstance(
        <Accordion>
            <Section title="The Section Title is always visible">
                This section is closed. You should not see this content.
            </Section>
        </Accordion>
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders an open Section correctly', () => {
    // Act.
    const instance = createTestInstance(
        <Accordion>
            <Section title="The Section Title is always visible" isOpen={true}>
                This section is open. You should see this content.
            </Section>
        </Accordion>
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
