import React from 'react';
import { storiesOf } from '@storybook/react';

import ProductList from '../productList';
import 'src/index.css';

const stories = storiesOf('Mini Cart/Product List', module);

const items = [
    {
        item_id: 1,
        name: 'Product 1',
        price: 10,
        qty: 1,
        sku: 'TEST1',
        image: 'test.jpg'
    },
    {
        item_id: 2,
        name: 'Product 2',
        price: 5,
        qty: 1,
        sku: 'TEST2',
        image: 'test.jpg'
    },
    {
        item_id: 3,
        name: 'Product 3',
        price: 15,
        qty: 1,
        sku: 'TEST3',
        image: 'test.jpg'
    }
];

stories.add('Product List With Kebab', () => (
    <ProductList
        items={items}
        currencyCode="NZD"
        removeItemFromCart={() => {}}
        openOptionsDrawer={() => {}}
    />
));
