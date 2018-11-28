import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { List } from '@magento/peregrine';

import PurchaseHistory from '../purchaseHistory';
import Filter from '../Filter';

configure({ adapter: new Adapter() });

test('renders correctly', () => {
    const wrapper = shallow(<PurchaseHistory />).dive();
    expect(wrapper.find(Filter)).toHaveLength(1);
    expect(wrapper.find(List)).toHaveLength(1);
});
