import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useDiscountSummary } from '../useDiscountSummary';
import { act } from 'react-test-renderer';

const Component = props => {
    const talonProps = useDiscountSummary(props);

    return <i {...talonProps} />;
};

const mockDiscountData = [
    {
        amount: {
            currency: 'USD',
            value: 10
        }
    },
    {
        amount: {
            currency: 'USD',
            value: 20
        }
    },
    {
        amount: {
            currency: 'USD',
            value: 30
        }
    }
];

it('returns the proper shape', () => {
    const props = {
        data: mockDiscountData
    };

    const rendered = createTestInstance(<Component {...props} />);

    const talonProps = rendered.root.findByType('i').props;

    expect(talonProps).toMatchInlineSnapshot(`
        Object {
          "discountData": Array [
            Object {
              "amount": Object {
                "currency": "USD",
                "value": 10,
              },
            },
            Object {
              "amount": Object {
                "currency": "USD",
                "value": 20,
              },
            },
            Object {
              "amount": Object {
                "currency": "USD",
                "value": 30,
              },
            },
          ],
          "expanded": false,
          "handleClick": [Function],
          "totalDiscount": Object {
            "currency": "USD",
            "value": 60,
          },
        }
    `);
});

it('toggles the expanded state when handleClick() is called', () => {
    const props = {
        data: mockDiscountData
    };

    const rendered = createTestInstance(<Component {...props} />);

    let talonProps = rendered.root.findByType('i').props;

    act(() => {
        talonProps.handleClick();
    });

    talonProps = rendered.root.findByType('i').props;

    expect(talonProps.expanded).toBeTruthy();

    act(() => {
        talonProps.handleClick();
    });
    talonProps = rendered.root.findByType('i').props;

    expect(talonProps.expanded).toBeFalsy();
});

describe('returns a default amount when', () => {
    test('there is no discount data', () => {
        const props = {};

        const rendered = createTestInstance(<Component {...props} />);

        const talonProps = rendered.root.findByType('i').props;

        expect(talonProps).toMatchInlineSnapshot(`
            Object {
              "discountData": undefined,
              "expanded": false,
              "handleClick": [Function],
              "totalDiscount": Object {
                "currency": "USD",
                "value": 0,
              },
            }
        `);
    });

    test('discount data is an empty array', () => {
        const props = {
            data: []
        };

        const rendered = createTestInstance(<Component {...props} />);

        const talonProps = rendered.root.findByType('i').props;

        expect(talonProps).toMatchInlineSnapshot(`
            Object {
              "discountData": Array [],
              "expanded": false,
              "handleClick": [Function],
              "totalDiscount": Object {
                "currency": "USD",
                "value": 0,
              },
            }
        `);
    });
});
