import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { List } from '@magento/peregrine';

import PurchaseHistory from '../purchaseHistory';
import Filter from '../../Filter';

configure({ adapter: new Adapter() });

test('renders correctly', () => {
    const wrapper = shallow(
        <PurchaseHistory
            getPurchaseHistory={() => {}}
            resetPurchaseHistory={() => {}}
        />
    ).dive();
    expect(wrapper.find(Filter)).toHaveLength(1);
    expect(wrapper.find(List)).toHaveLength(1);
});

test('getPurchaseHistory is called when component was mounted', () => {
    const getPurchaseHistoryMock = jest.fn();

    shallow(
        <PurchaseHistory
            getPurchaseHistory={getPurchaseHistoryMock}
            resetPurchaseHistory={() => {}}
        />
    ).dive();

    expect(getPurchaseHistoryMock).toBeCalled();
});

test('resetPurchaseHistory is called when component was unmounted', () => {
    const resetPurchaseHistoryMock = jest.fn();

    const wrapper = shallow(
        <PurchaseHistory
            getPurchaseHistory={() => {}}
            resetPurchaseHistory={resetPurchaseHistoryMock}
        />
    ).dive();
    wrapper.unmount();

    expect(resetPurchaseHistoryMock).toBeCalled();
});
