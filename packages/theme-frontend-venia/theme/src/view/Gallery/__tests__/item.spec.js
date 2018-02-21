import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Item from '../item';

configure({ adapter: new Adapter() });

const validItem = {
    key: 'foo',
    image: 'foo.jpg',
    name: 'Foo',
    price: '$1.00'
};

/**
 * STATE 0: awaiting item data
 * `item` is `null` or `undefined`
 * `showImage` is irrelevant
 */
test('renders a placeholder item while awaiting item', () => {
    const wrapper = shallow(<Item />);

    expect(wrapper.hasClass('gallery-item')).toBe(true);
    expect(wrapper.prop('data-placeholder')).toBe(true);
});

test('renders only a placeholder image while awaiting item', () => {
    const wrapper = shallow(<Item />);
    const images = wrapper.find('.gallery-item-image');

    expect(images).toHaveLength(1);
    expect(images.first().prop('data-placeholder')).toBe(true);
});

/**
 * STATE 1: awaiting showImage flag
 * `item` is a valid data object
 * `showImage` is `false`
 */
test('renders placeholder and real image when `showImage: false`', () => {
    const wrapper = shallow(<Item item={validItem} showImage={false} />);
    const images = wrapper.find('.gallery-item-image');

    expect(images).toHaveLength(2);
    expect(images.first().prop('data-placeholder')).toBe(true);
    expect(images.last().prop('data-placeholder')).toBeUndefined();
});

test('renders real image even without `onLoad` and `onError`', () => {
    const wrapper = shallow(<Item item={validItem} showImage={false} />);
    const image = wrapper.find('.gallery-item-image').last();

    expect(() => image.simulate('load')).not.toThrow();
    expect(() => image.simulate('error')).not.toThrow();
});

test('calls `onLoad` properly on image `load`', () => {
    const handleLoad = jest.fn();
    const wrapper = shallow(
        <Item item={validItem} showImage={false} onLoad={handleLoad} />
    );

    wrapper
        .find('.gallery-item-image')
        .last()
        .simulate('load');

    expect(handleLoad).toBeCalledWith(validItem.key);
});

test('calls `onError` properly on image `error`', () => {
    const handleError = jest.fn();
    const wrapper = shallow(
        <Item item={validItem} showImage={false} onError={handleError} />
    );

    wrapper
        .find('.gallery-item-image')
        .last()
        .simulate('error');

    expect(handleError).toBeCalledWith(validItem.key);
});

/**
 * STATE 2: ready
 * `item` is a valid data object
 * `showImage` is `true`
 */
test('renders only the real image when `showImage: true`', () => {
    const wrapper = shallow(<Item item={validItem} showImage={true} />);
    const images = wrapper.find('.gallery-item-image');

    expect(images).toHaveLength(1);
    expect(images.first().prop('data-placeholder')).toBeUndefined();
});
