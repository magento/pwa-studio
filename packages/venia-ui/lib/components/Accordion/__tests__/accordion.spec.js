import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Accordion from '../accordion';
import Section from '../section';

jest.mock('../../../classify');

test('it renders a closed Section correctly', () => {
    // Act.
    const instance = createTestInstance(
        <Accordion>
            <Section title="The Section Title is always visible">
                This section is closed. Its className should match.
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
                This section is open. Its className should match.
            </Section>
        </Accordion>
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
