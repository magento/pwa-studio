import React from 'react';
import { useQuery } from '@apollo/client';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import SubTypeAttribute from '../subTypeAttribute';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useQuery: jest.fn().mockReturnValue({})
}));

test('renders null without sub_type', () => {
    const tree = createTestInstance(<SubTypeAttribute item={{ id: 1 }} />);

    expect(tree.toJSON()).toMatchInlineSnapshot(`null`);
});

test('renders skeleton while fetching attribute metadata', () => {
    const tree = createTestInstance(
        <SubTypeAttribute item={{ id: 1, sub_type: 123 }} />
    );

    expect(tree.toJSON()).toMatchInlineSnapshot(`
        <span
          className="root"
        />
    `);
});

test('renders attribute label with metadata', () => {
    useQuery.mockReturnValue({
        data: {
            customAttributeMetadata: {
                items: [
                    {
                        attribute_options: [
                            { label: 'Consultation', value: 456 },
                            { label: 'Service', value: 123 },
                            { label: 'Donation', value: 789 }
                        ]
                    }
                ]
            }
        }
    });

    const tree = createTestInstance(
        <SubTypeAttribute item={{ id: 1, sub_type: 123 }} />
    );

    expect(tree.toJSON()).toMatchInlineSnapshot(`
        <span
          className="root"
        >
          Service
        </span>
    `);
});
