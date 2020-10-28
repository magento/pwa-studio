import React from 'react';
import ContainerChild from '..';
import { shallow } from 'enzyme';

test('Renders content from render prop', () => {
    const wrapper = shallow(
        <ContainerChild
            id="foo.bar"
            render={() => <mock-Child />}
            processed={true}
        />
    );
    expect(wrapper.equals(<mock-Child />)).toBe(true);
});
