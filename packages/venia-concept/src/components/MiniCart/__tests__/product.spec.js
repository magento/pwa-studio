import React from 'react';
import { shallow } from 'enzyme';

import Product from '../product';
import Section from '../section';

const classes = { firstSection: 'a', optionLabel: 'b', name: 'c' };

const item = {
    item_id: 1,
    name: 'Product 1',
    price: 10,
    qty: 1,
    sku: 'TEST1',
    image: 'test.jpg',
    options: [
        {
            label: 'testLabel',
            value: 'testValue'
        },
        {
            label: 'testLabel2',
            value: 'testValue2'
        }
    ]
};

test('passed functions are called from nested `Section` components', () => {
    const removeItemFromCart = jest.fn();
    const showEditPanel = jest.fn();
    let wrapper = shallow(
        <Product
            classes={classes}
            item={item}
            currencyCode={'NZD'}
            removeItemFromCart={removeItemFromCart}
            showEditPanel={showEditPanel}
        />
    ).dive();

    const favoriteItem = jest.spyOn(wrapper.instance(), 'favoriteItem');
    const editItem = jest.spyOn(wrapper.instance(), 'editItem');
    const removeItem = jest.spyOn(wrapper.instance(), 'removeItem');

    wrapper.instance().forceUpdate();

    const buttons = wrapper.find(Section);

    buttons.forEach(button => {
        button.simulate('click');
    });

    expect(favoriteItem).toHaveBeenCalled();
    expect(editItem).toHaveBeenCalled();
    expect(removeItem).toHaveBeenCalled();
});

test('Product name is rendered', () => {
    const wrapper = shallow(
        <Product item={item} currencyCode={'EUR'} classes={classes} />
    ).dive();

    expect(
        wrapper
            .find(`.${classes.name}`)
            .at(0)
            .text()
    ).toContain(item.name);
});

test('Product variants are rendered', () => {
    const wrapper = shallow(
        <Product item={item} currencyCode={'EUR'} classes={classes} />
    ).dive();

    wrapper.find(`.${classes.optionLabel}`).forEach((optionLabel, i) => {
        expect(optionLabel.text()).toContain(item.options[i].label);
        expect(optionLabel.text()).toContain(item.options[i].value);
    });
});
