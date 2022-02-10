import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import GiftOptionsSummary from '../giftOptionsSummary.ee';

const defaultProps = {
    classes: {
        lineItemLabel: 'lineItemLabel',
        price: 'price'
    },
    data: {
        printed_card: {
            value: 10,
            currency: 'USD'
        }
    }
};

describe('#GiftOptionsSummary AC', () => {
    it('renders gift options summary line item correctly', () => {
        const tree = createTestInstance(
            <GiftOptionsSummary {...defaultProps} />
        );

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders accumulated gift options value', () => {
        const props = {
            ...defaultProps,
            data: {
                printed_card: {
                    value: 10,
                    currency: 'USD'
                }
            }
        };

        const tree = createTestInstance(<GiftOptionsSummary {...props} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders nothing if gift options data is empty', () => {
        const props = {
            ...defaultProps,
            data: {}
        };
        const tree = createTestInstance(<GiftOptionsSummary {...props} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders nothing if gift options value is "0"', () => {
        const props = {
            ...defaultProps,
            data: {
                printed_card: {
                    value: 0,
                    currency: 'USD'
                }
            }
        };
        const tree = createTestInstance(<GiftOptionsSummary {...props} />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
