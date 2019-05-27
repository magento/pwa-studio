import React from 'react';
import { shallow } from 'enzyme';
import CartOptions from '../cartOptions';

const cartItem = {
    qty: 1,
    name: 'Test',
    price: 5,
    item_id: 5,
    sku: 'PRODUCT-S'
};

const configItem = {
    __typename: 'ConfigurableProduct',
    configurable_options: [
        {
            attribute_code: 'size',
            attribute_id: '26',
            id: 1,
            label: 'Size',
            values: [
                {
                    default_label: 'L',
                    value_index: 26
                }
            ]
        }
    ],
    variants: [
        {
            product: {
                size: 26,
                id: 2,
                media_gallery_entries: [
                    {
                        label: 'test',
                        position: 1
                    }
                ],
                sku: 'PRODUCT-L',
                stock_status: 'IN_STOCK'
            }
        }
    ]
};

test('submit action updates the cart item using configurable product data', () => {
    const { id, sku } = configItem.variants[0].product;

    const updateCart = payload => {
        Object.assign(cartItem, {
            item_id: payload.item.id,
            sku: payload.item.sku
        });
    };
    const closeOptionsDrawer = jest.fn();
    const wrapper = shallow(
        <CartOptions
            cartItem={cartItem}
            configItem={configItem}
            updateCart={updateCart}
            closeOptionsDrawer={closeOptionsDrawer}
        />
    ).dive();

    wrapper.instance().handleClick();
    expect(cartItem.item_id).toEqual(id);
    expect(cartItem.sku).toEqual(sku);
});
