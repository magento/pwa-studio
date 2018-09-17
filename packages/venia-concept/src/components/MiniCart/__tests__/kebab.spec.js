import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Kebab from '../kebab';

configure({ adapter: new Adapter() });

const classes = {
    root: 'a',
    buttonRemoveItem: 'b',
    dropdown: 'c',
    active: 'd'
};

const item = {
    id: 1,
    name: 'Test Product 1',
    small_image: '/test/product/1.png',
    price: {
        regularPrice: {
            amount: {
                value: 100,
                currency: 'USD'
            }
        }
    }
}

test('renders with item data', () => {
    const wrapper = shallow(
        <Kebab
            classes={classes}
            item={item}
        />
    ).dive();

    expect(wrapper.hasClass(classes.root)).toBe(true);
});

test('"remove item" button fires the correct function', () => {
    const wrapper = shallow(
        <Kebab
            classes={classes}
            removeItemFromCart={() => {}}
        />
    ).dive();

    const spy = jest.spyOn(wrapper.instance(), 'removeItem');
    const button = wrapper.find({ className: classes.buttonRemoveItem });

    button.simulate('click');
    expect(spy).toHaveBeenCalled();
});

test('menu toggles to active when clicked', () => {
    const wrapper = shallow(
        <Kebab
            classes={classes}
        />
    ).dive();

    let menu = wrapper.find('ul');
    expect(menu.hasClass(classes.active)).toBe(false);

    wrapper
        .find('button')
        .first()
        .simulate('click');

    menu = wrapper.find('ul');
    expect(menu.hasClass(classes.active)).toBe(true);
});

test('menu closes on blur', () =>{
    const wrapper = shallow(
        <Kebab
            classes={classes}
        />
    ).dive();

    const button = wrapper.find('button').first();
    button.simulate('click');
    let menu = wrapper.find('ul');
    expect(menu.hasClass(classes.active)).toBe(true);

    button.simulate('blur');
    menu = wrapper.find('ul');
    expect(menu.hasClass(classes.active)).toBe(false);
});
