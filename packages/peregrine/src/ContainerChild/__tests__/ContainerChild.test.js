import React from 'react';
import ContainerChild from '..';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

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
