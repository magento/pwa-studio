import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Kebab from '../kebab';

jest.mock('src/components/Icon', () => ({
    __esModule: true,
    default: () => <span>Mock Icon Component</span>
}));

test('it renders correctly without children', () => {
    const tree = createTestInstance(<Kebab />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('it renders children passed to it', () => {
    const tree = createTestInstance(
        <Kebab>
            <div>Child 1</div>
            <div>Child 2</div>
            <div>Child 3</div>
        </Kebab>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
