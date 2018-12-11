import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import header from '../header';
import Trigger from '../cartTrigger';

configure({ adapter: new Adapter() });

test('Triggers cart modal when item added', () => {
    const wrapper = shallow(
        <Trigger />
    );
    console.log(wrapper.debug());
});
