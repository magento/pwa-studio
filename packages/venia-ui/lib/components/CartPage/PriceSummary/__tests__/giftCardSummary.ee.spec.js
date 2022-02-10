import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import GiftCardSummary from '../giftCardSummary.ee';

const defaultProps = {
    classes: {
        lineItemLabel: 'lineItemLabel',
        price: 'price'
    },
    data: [
        {
            applied_balance: {
                value: 10,
                currency: 'USD'
            }
        }
    ]
};

describe('#GiftCardSummary AC', () => {
    it('renders gift card summary line item correctly', () => {
        const tree = createTestInstance(<GiftCardSummary {...defaultProps} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders accumulated gift card value', () => {
        const props = {
            ...defaultProps,
            data: [
                {
                    applied_balance: {
                        value: 0,
                        currency: 'USD'
                    }
                },
                {
                    applied_balance: {
                        value: 1,
                        currency: 'USD'
                    }
                },
                {
                    applied_balance: {
                        value: 1,
                        currency: 'USD'
                    }
                }
            ]
        };

        const tree = createTestInstance(<GiftCardSummary {...props} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders nothing if gift card data is empty', () => {
        const props = {
            ...defaultProps,
            data: []
        };
        const tree = createTestInstance(<GiftCardSummary {...props} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders nothing if gift card value is "0"', () => {
        const props = {
            ...defaultProps,
            data: [
                {
                    applied_balance: {
                        value: 0,
                        currency: 'USD'
                    }
                }
            ]
        };
        const tree = createTestInstance(<GiftCardSummary {...props} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
