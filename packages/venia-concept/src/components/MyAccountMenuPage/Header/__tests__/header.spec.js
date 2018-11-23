import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from '../header';
import Trigger from 'src/components/Trigger';
import UserInformation from '../../UserInformation';

configure({ adapter: new Adapter() });

test('renders correctly', () => {
    const wrapper = shallow(<Header />).dive();

    expect(wrapper.find(UserInformation)).toHaveLength(1);
    expect(wrapper.find(Trigger)).toHaveLength(1);
});
