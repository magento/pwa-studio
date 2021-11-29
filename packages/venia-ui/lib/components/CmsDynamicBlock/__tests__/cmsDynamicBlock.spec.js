import React from 'react';
import { useQuery } from '@apollo/client';

import { createTestInstance } from '@magento/peregrine';

import CmsDynamicBlock, {
    GET_CMS_DYNAMIC_BLOCKS,
    fixedType,
    salesRuleType,
    catalogPriceRuleType
} from '../cmsDynamicBlock';

const mockUids = 'uids';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useQuery: jest.fn()
}));

jest.mock('@magento/venia-ui/lib/components/ErrorView', () => props => (
    <mock-ErrorView {...props} />
));
jest.mock('../DynamicBlock', () => props => <mock-DynamicBlock {...props} />);

let inputProps = {};

const Component = () => {
    return <CmsDynamicBlock {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        displayMode: 'fixed',
        uids: mockUids
    };
};

const givenCatalogRuleType = () => {
    inputProps = {
        displayMode: 'catalogrule',
        uids: mockUids
    };
};

const givenSalesRuleType = () => {
    inputProps = {
        displayMode: 'salesrule',
        uids: mockUids
    };
};

const givenUnknownType = () => {
    inputProps = {
        displayMode: 'test',
        uids: mockUids
    };
};

describe('#CmsDynamicBlock', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders null when loading', () => {
        useQuery.mockReturnValue({
            data: null,
            loading: true
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders ErrorView when error', () => {
        useQuery.mockReturnValue({
            data: null,
            loading: false,
            error: {
                message: 'Error'
            }
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders null when no data', () => {
        useQuery.mockReturnValue({
            data: null,
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders null when items are empty', () => {
        useQuery.mockReturnValue({
            data: {
                dynamicBlocks: {
                    items: []
                }
            },
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders DynamicBlock when data with type fixed', () => {
        useQuery.mockReturnValue({
            data: {
                dynamicBlocks: {
                    items: [
                        {
                            content: {
                                html: 'Hello World'
                            },
                            uid: 'uid'
                        }
                    ]
                }
            },
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: { type: fixedType, uids: mockUids }
            })
        );

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders useQuery with type catalogrule', () => {
        givenCatalogRuleType();

        createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: { type: catalogPriceRuleType, uids: mockUids }
            })
        );
    });

    it('renders useQuery with type salesrule', () => {
        givenSalesRuleType();

        createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: { type: salesRuleType, uids: mockUids }
            })
        );
    });

    it('renders useQuery with unknown type', () => {
        givenUnknownType();

        createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: { type: fixedType, uids: mockUids }
            })
        );
    });
});
