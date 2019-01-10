import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { List } from '@magento/peregrine';
import OrderItemsList from '../OrderItemsList';

configure({ adapter: new Adapter() });

const classes = {
    header: 'header'
};

const itemsMock = [
    {
        id: 1,
        name: 'name',
        size: '42',
        color: 'color',
        qty: 1,
        titleImageSrc: 'picture',
        price: 27,
        sku: 'sku'
    },
    {
        id: 2,
        name: 'name',
        size: '42',
        color: 'color',
        qty: 1,
        titleImageSrc: 'picture',
        price: 27,
        sku: 'sku'
    }
];

test('renders correctly', () => {
    const wrapper = shallow(
        <OrderItemsList classes={classes} title="title" items={itemsMock} />
    ).dive();

    expect(wrapper.find(`.${classes.header}`)).toHaveLength(1);
    expect(wrapper.find(List)).toHaveLength(1);
});
