import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DetailsBlock from '../../DetailsBlock';
import PurchaseDetails from '../purchaseDetails';

configure({ adapter: new Adapter() });

test('renders correctly', () => {
    const wrapper = shallow(<PurchaseDetails />).dive();

    expect(wrapper.find(DetailsBlock)).toHaveLength(4);
});
