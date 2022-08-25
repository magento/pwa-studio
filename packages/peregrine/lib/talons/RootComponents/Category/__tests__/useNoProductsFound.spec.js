import React from 'react';
import { useCatalogContext } from '../../../../context/catalog';
import { createTestInstance } from '@magento/peregrine';

import { useNoProductsFound } from '../useNoProductsFound';

jest.mock('../../../../context/catalog', () => ({
    useCatalogContext: jest.fn()
}));

const Component = props => {
    const talonProps = useNoProductsFound(props);

    return <i {...talonProps} />;
};

const props = {
    categoryId: '3'
};

const mockCatalogContext = {
    categories: [
        {
            parentId: 0,
            id: 1
        },
        {
            parentId: 1,
            id: 2
        },
        {
            parentId: 1,
            id: 3
        },
        {
            parentId: 1,
            id: 4
        },
        {
            parentId: 1,
            id: 5
        },
        {
            parentId: 1,
            id: 6
        }
    ]
};
describe('useNoProductsFound tests', () => {
    it('returns the proper shape', () => {
        useCatalogContext.mockReturnValue([mockCatalogContext]);

        const rendered = createTestInstance(<Component {...props} />);

        const talonProps = rendered.root.findByType('i').props;

        const { recommendedCategories } = talonProps;

        expect(recommendedCategories).toHaveLength(3);
    });

    it('handles fewer categories than default amount to show', () => {
        useCatalogContext.mockReturnValue([
            {
                categories: [
                    {
                        parentId: 0,
                        id: 1
                    },
                    {
                        parentId: 1,
                        id: 2
                    }
                ]
            }
        ]);

        const rendered = createTestInstance(<Component {...props} />);

        const talonProps = rendered.root.findByType('i').props;

        const { recommendedCategories } = talonProps;

        expect(recommendedCategories).toHaveLength(1);
    });
});
