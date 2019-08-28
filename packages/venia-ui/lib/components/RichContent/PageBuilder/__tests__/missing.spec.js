import React from 'react';
import testRenderer from 'react-test-renderer';
import Missing from '../missing';

jest.mock('../../../../classify');

test('renders a Missing component', () => {
    const missingProps = {
        contentType: 'test-content-type'
    };
    const component = testRenderer.create(<Missing {...missingProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
