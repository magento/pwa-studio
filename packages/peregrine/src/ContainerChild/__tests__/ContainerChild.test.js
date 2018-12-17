import React from 'react';
import ContainerChild from '..';
import { shallow } from 'enzyme';

test('Renders content from render prop', () => {
    const wrapper = shallow(
        <ContainerChild
            id="foo.bar"
            render={() => <div>Hello World</div>}
            processed={true}
        />
    );
    expect(wrapper.equals(<div>Hello World</div>)).toBe(true);
});
