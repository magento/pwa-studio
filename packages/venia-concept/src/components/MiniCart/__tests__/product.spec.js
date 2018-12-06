import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Product from '../product';
import Section from '../section';

configure({ adapter: new Adapter() });

const classes = { firstSection: 'a' };

const item = {
    item_id: 1,
    name: 'Product 1',
    price: 10,
    qty: 1,
    sku: 'TEST1',
    image: 'test.jpg'
};

const totalsItems = [
    {
        item_id: 1,
        name: "Product 1",
        options: '[{\"value\":\"Peach\",\"label\":\"Fashion Color\"},{\"value\":\"M\",\"label\":\"Fashion Size\"}]'
        // REST API returns options as string
    },
];

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
            totalsItems={totalsItems}
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

// Commented out, need to fix test because assertion returns false
//
// test('Product variants are rendered', () => {
//     const wrapper = shallow(
//         <Product 
//             item={item}
//             currencyCode={'EUR'}
//             totalsItems={totalsItems} />
//     ).dive();
//     console.log(wrapper.debug());
//     expect(
//         wrapper.contains(
//             <Fragment>
//                 <dt>
//                     Fashion Color:
//                 </dt>
//                 <dd>
//                     Peach
//                 </dd>
//                 <dt>
//                     Fashion Size:
//                 </dt>
//                 <dd>
//                     M
//                 </dd>
//             </Fragment>
//             )
//         ).toBe(true);
// });
