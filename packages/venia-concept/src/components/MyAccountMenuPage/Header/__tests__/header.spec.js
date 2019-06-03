import React from 'react';
import { shallow } from 'enzyme';
import Header from '../header';
import Trigger from 'src/components/Trigger';
import UserInformation from '../../UserInformation';
import OnlineIndicator from '../../../OnlineIndicator';

test('renders correctly', () => {
    const wrapper = shallow(<Header />).dive();

    expect(wrapper.find(UserInformation)).toHaveLength(1);
    expect(wrapper.find(Trigger)).toHaveLength(1);
    expect(wrapper.find(OnlineIndicator)).toHaveLength(0);
});
