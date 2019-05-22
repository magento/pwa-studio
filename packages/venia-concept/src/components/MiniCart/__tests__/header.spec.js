import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Header from '../header';

jest.mock('../trigger');
jest.mock('src/components/Icon', () => ({
    __esModule: true,
    default: () => <span>Mock Icon Component</span>
}));

test('it renders correctly', () => {
    const props = {
        isEditingItem: false
    };

    const tree = createTestInstance(<Header {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('it changes the title when editing an item', () => {
    const props = {
        isEditingItem: true
    };

    const tree = createTestInstance(<Header {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
