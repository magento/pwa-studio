import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import { useCmsDynamicBlock } from '@magento/peregrine/lib/talons/CmsDynamicBlock/useCmsDynamicBlock';

import {
    DISPLAY_MODE_FIXED_TYPE,
    DISPLAY_MODE_SALES_RULE_TYPE,
    DISPLAY_MODE_CATALOG_RULE_TYPE
} from '../constants';
import CmsDynamicBlock from '../cmsDynamicBlock.ee';

const mockUids = 'uids';

jest.mock('@magento/peregrine/lib/talons/CmsDynamicBlock/useCmsDynamicBlock');
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

describe('#CmsDynamicBlock AC', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('renders null when loading', () => {
        useCmsDynamicBlock.mockReturnValueOnce({
            data: null,
            error: undefined,
            loading: true
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders ErrorView when error', () => {
        useCmsDynamicBlock.mockReturnValueOnce({
            data: null,
            error: {
                message: 'Error'
            },
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders null when no data', () => {
        useCmsDynamicBlock.mockReturnValueOnce({
            data: null,
            error: undefined,
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders null when items are empty', () => {
        useCmsDynamicBlock.mockReturnValue({
            data: {
                dynamicBlocks: {
                    items: []
                }
            },
            error: undefined,
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders DynamicBlock when data with type fixed', () => {
        useCmsDynamicBlock.mockReturnValue({
            data: {
                dynamicBlocks: {
                    items: [
                        {
                            uid: 'itemUid1',
                            content: {
                                html: '<div>Item 1</div>'
                            }
                        }
                    ]
                }
            },
            error: undefined,
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders DynamicBlock when data with type catalogrule', () => {
        givenCatalogRuleType();

        useCmsDynamicBlock.mockReturnValue({
            data: {
                dynamicBlocks: {
                    items: [
                        {
                            uid: 'itemUid1',
                            content: {
                                html: '<div>Item 1</div>'
                            }
                        }
                    ]
                }
            },
            error: undefined,
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders DynamicBlock when data with type salesrule', () => {
        givenSalesRuleType();

        useCmsDynamicBlock.mockReturnValue({
            data: {
                dynamicBlocks: {
                    items: [
                        {
                            uid: 'itemUid1',
                            content: {
                                html: '<div>Item 1</div>'
                            }
                        }
                    ]
                }
            },
            error: undefined,
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('renders DynamicBlock when data with unknown type', () => {
        givenUnknownType();

        useCmsDynamicBlock.mockReturnValue({
            data: {
                dynamicBlocks: {
                    items: [
                        {
                            uid: 'itemUid1',
                            content: {
                                html: '<div>Item 1</div>'
                            }
                        }
                    ]
                }
            },
            error: undefined,
            loading: false
        });

        const component = createTestInstance(<Component />);

        expect(component.toJSON()).toMatchSnapshot();
    });
});
