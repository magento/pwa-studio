import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Receipt from '../receipt';
import ReceiptButton from '../ReceiptButton';

configure({ adapter: new Adapter() });

test('contains two buttons', () => {
    const wrapper = shallow(<Receipt />).dive();
    expect(wrapper.find(ReceiptButton)).toBeTruthy();
});
