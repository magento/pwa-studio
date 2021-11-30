import React from 'react';
import { act } from 'react-test-renderer';
import { useQuery } from '@apollo/client';

import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import CmsDynamicBlock, {
    DYNAMIC_BLOCK_FIXED_TYPE,
    DYNAMIC_BLOCK_SALES_RULE_TYPE,
    DYNAMIC_BLOCK_CATALOG_RULE_TYPE,
    GET_CMS_DYNAMIC_BLOCKS
} from '../cmsDynamicBlock.ee';

const mockUids = 'uids';
const mockLocations = ['CONTENT'];
const mockRefetch = jest.fn();

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useRef: jest.fn().mockReturnValue({
        current: false
    })
}));

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

const givenLocations = () => {
    inputProps = {
        locations: mockLocations,
        uids: mockUids
    };
};

describe('#CmsDynamicBlock EE', () => {
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
            loading: false,
            refetch: mockRefetch
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

    it('refetches data when user signs in', () => {
        const tree = createTestInstance(<Component />);

        // Sign in
        act(() => {
            useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);

            tree.update(<Component />);
        });

        expect(mockRefetch).toHaveBeenCalled();
    });
});
