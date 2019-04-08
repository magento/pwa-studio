import React from 'react';
import testRenderer from 'react-test-renderer';

import Filter from '../filter';

jest.mock('src/classify');

test('it renders a Filter correctly', () => {
    const component = testRenderer.create(<Filter />);

    expect(component).toMatchSnapshot();
});
