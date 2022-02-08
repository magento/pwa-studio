import React from 'react';
import { useQuery } from '@apollo/client';

import { createTestInstance } from '@magento/peregrine';

import {
    DISPLAY_MODE_FIXED_TYPE,
    DYNAMIC_BLOCK_FIXED_TYPE,
    DISPLAY_MODE_SALES_RULE_TYPE,
    DYNAMIC_BLOCK_SALES_RULE_TYPE,
    DISPLAY_MODE_CATALOG_RULE_TYPE,
    DYNAMIC_BLOCK_CATALOG_RULE_TYPE
} from '../constants';
import CmsDynamicBlock, { GET_CMS_DYNAMIC_BLOCKS } from '../cmsDynamicBlock.ac';

const mockUids = 'uids';
const mockLocations = ['CONTENT'];

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useQuery: jest.fn()
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: false }])
}));

jest.mock('@magento/venia-ui/lib/components/ErrorView', () => props => (
    <mock-ErrorView {...props} />
));
jest.mock('../dynamicBlock', () => props => <mock-DynamicBlock {...props} />);

let inputProps = {};

const Component = () => {
    return <CmsDynamicBlock {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        displayMode: DISPLAY_MODE_FIXED_TYPE,
        uids: mockUids
    };
};

const givenCatalogRuleType = () => {
    inputProps = {
        displayMode: DISPLAY_MODE_CATALOG_RULE_TYPE,
        uids: mockUids
    };
};

const givenSalesRuleType = () => {
    inputProps = {
        displayMode: DISPLAY_MODE_SALES_RULE_TYPE,
        uids: mockUids
    };
};

const givenUnknownType = () => {
    inputProps = {
        displayMode: 'test',
        uids: mockUids
    };
};

const givenLocations = () => {
    inputProps = {
        locations: mockLocations,
        uids: mockUids
    };
};

describe('#CmsDynamicBlock AC', () => {
    beforeEach(() => {
        givenDefaultValues();

        useQuery.mockReturnValueOnce({
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
    });

    it('renders null when loading', () => {
        useQuery.mockReturnValueOnce({
            data: null,
            loading: true
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders ErrorView when error', () => {
        useQuery.mockReturnValueOnce({
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
        useQuery.mockReturnValueOnce({
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
        const component = createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: { type: DYNAMIC_BLOCK_FIXED_TYPE, uids: mockUids }
            })
        );

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('calls useQuery with type catalogrule', () => {
        givenCatalogRuleType();

        createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: {
                    type: DYNAMIC_BLOCK_CATALOG_RULE_TYPE,
                    uids: mockUids
                }
            })
        );
    });

    it('calls useQuery with type salesrule', () => {
        givenSalesRuleType();

        createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: {
                    type: DYNAMIC_BLOCK_SALES_RULE_TYPE,
                    uids: mockUids
                }
            })
        );
    });

    it('calls useQuery with unknown type', () => {
        givenUnknownType();

        createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: { type: DYNAMIC_BLOCK_FIXED_TYPE, uids: mockUids }
            })
        );
    });

    it('calls useQuery with locations', () => {
        givenLocations();

        createTestInstance(<Component />);

        expect(useQuery).toHaveBeenCalledWith(
            GET_CMS_DYNAMIC_BLOCKS,
            expect.objectContaining({
                variables: {
                    type: DYNAMIC_BLOCK_FIXED_TYPE,
                    locations: mockLocations,
                    uids: mockUids
                }
            })
        );
    });
});
