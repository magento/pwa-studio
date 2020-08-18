import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Password from '../password';

test('should render properly', () => {
    const tree = createTestInstance(
        <Password
            label="Password"
            fieldName="password"
            isToggleButtonHidden={true}
        />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('should render toggle button if isToggleButtonHidden is false', () => {
    const tree = createTestInstance(
        <Password
            label="Password"
            fieldName="password"
            isToggleButtonHidden={false}
        />
    );
    expect(tree.toJSON()).toMatchSnapshot();
});
