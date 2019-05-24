import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import MiniCart from '../miniCart';

jest.mock('../body');
jest.mock('../header');
jest.mock('../footer');

test('renders correctly', () => {
    const props = {
        beginEditItem: jest.fn(),
        endEditItem: jest.fn(),
        cart: {
            isEditingItem: false
        }
    };

    const tree = createTestInstance(<MiniCart {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
