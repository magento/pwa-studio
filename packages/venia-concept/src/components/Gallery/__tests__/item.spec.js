import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Link, MemoryRouter } from 'react-router-dom';

import Item from '../item';

configure({ adapter: new Adapter() });

const classes = {
    image: 'a',
    image_pending: 'b',
    imagePlaceholder: 'c',
    imagePlaceholder_pending: 'd',
    images: 'e',
    images_pending: 'f',
    name: 'g',
    name_pending: 'h',
    price: 'i',
    price_pending: 'j',
    root: 'k',
    root_pending: 'l'
};

const validItem = {
    id: 1,
    name: 'Test Product',
    small_image: '/foo/bar/pic.png',
    url_key: 'strive-shoulder-pack',
    price: {
        regularPrice: {
            amount: {
                value: 21,
                currency: 'USD'
            }
        }
    }
};

/**
 * STATE 0: awaiting item data
 * `item` is `null` or `undefined`
 * `showImage` is irrelevant
 */
test('renders a placeholder item while awaiting item', () => {
    const wrapper = shallow(<Item classes={classes} />).dive();
    const child = wrapper.find('ItemPlaceholder');
    const props = { classes };

    expect(child).toHaveLength(1);
    expect(child.props()).toMatchObject(props);
});

test('passes classnames to the placeholder item', () => {
    const wrapper = shallow(<Item classes={classes} />)
        .dive()
        .dive();

    expect(wrapper.hasClass(classes.root_pending));
});

test('renders Link elements for navigating to a PDP', () => {
    const wrapper = shallow(
        <MemoryRouter>
            <Item classes={classes} item={validItem} />
        </MemoryRouter>
    );

    expect(
        wrapper
            .childAt(0)
            .dive()
            .dive()
            .findWhere(
                node =>
                    node.type() === Link &&
                    node.prop('to') === `/${validItem.url_key}.html`
            )
    ).toHaveLength(2);
});

/**
 * STATE 1: awaiting showImage flag
 * `item` is a valid data object
 * `showImage` is `false`
 */
test('renders both images when `showImage: false`', () => {
    const wrapper = shallow(
        <Item classes={classes} item={validItem} showImage={false} />
    ).dive();
    const realImage = wrapper.find({ className: classes.image_pending });
    const placeholderImage = wrapper.find({
        className: classes.imagePlaceholder
    });

    expect(realImage).toHaveLength(1);
    expect(placeholderImage).toHaveLength(1);
});

test('handles `load` and `error` events', () => {
    const wrapper = shallow(
        <Item classes={classes} item={validItem} showImage={false} />
    ).dive();
    const image = wrapper.find({ className: classes.image_pending }).first();

    expect(() => image.simulate('load')).not.toThrow();
    expect(() => image.simulate('error')).not.toThrow();
});

test('calls `onLoad` on image `load`', () => {
    const handleLoad = jest.fn();
    const wrapper = shallow(
        <Item
            classes={classes}
            item={validItem}
            showImage={false}
            onLoad={handleLoad}
        />
    ).dive();

    wrapper
        .find({ className: classes.image_pending })
        .first()
        .simulate('load');

    expect(handleLoad).toBeCalledWith(validItem.id);
});

test('calls `onError` on image `error`', () => {
    const handleError = jest.fn();
    const wrapper = shallow(
        <Item
            classes={classes}
            item={validItem}
            showImage={false}
            onError={handleError}
        />
    ).dive();

    wrapper
        .find({ className: classes.image_pending })
        .first()
        .simulate('error');

    expect(handleError).toBeCalledWith(validItem.id);
});

/**
 * STATE 2: ready
 * `item` is a valid data object
 * `showImage` is `true`
 */
test('renders only the real image when `showImage: true`', () => {
    const wrapper = shallow(
        <Item classes={classes} item={validItem} showImage={true} />
    ).dive();
    const image = wrapper.find({ className: classes.image });

    expect(image).toHaveLength(1);
});
