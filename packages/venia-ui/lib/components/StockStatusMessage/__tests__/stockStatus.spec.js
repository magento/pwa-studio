import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import {
    useStockStatus,
    LOW_STOCK,
    OUT_OF_STOCK
} from '@magento/peregrine/lib/talons/StockStatusMessage';

import StockStatus from '../stockStatus';

jest.mock('react-intl', () => ({
    FormattedMessage: ({ defaultMessage }) => defaultMessage
}));

jest.mock('@magento/peregrine/lib/talons/StockStatusMessage');

let inputProps = {};

const Component = () => {
    return <StockStatus {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        item: {}
    };
};

describe('#StockStatus', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders null if no stock status is returned', () => {
        useStockStatus.mockReturnValueOnce({
            stockStatus: null
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders low in stock message if low stock status is returned', () => {
        useStockStatus.mockReturnValueOnce({
            stockStatus: LOW_STOCK
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it('renders out of stock message if out of stock status is returned', () => {
        useStockStatus.mockReturnValueOnce({
            stockStatus: OUT_OF_STOCK
        });

        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
