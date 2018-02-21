import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import cheerio from 'cheerio';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Items, { emptyData } from '../items';

configure({ adapter: new Adapter() });

// use cheerio directly rather than enzyme
// since enzyme doesn't support React Fragment yet
// see https://github.com/airbnb/enzyme/issues/1213
const render = element => cheerio.load(renderToStaticMarkup(element));

const items = [{ key: 'a' }, { key: 'b' }];

test('emptyData contains only nulls', () => {
    expect(emptyData.every(v => v === null)).toBe(true);
});

test('renders if items is an empty array', () => {
    const wrapper = render(<Items items={[]} />);

    expect(wrapper.text()).toBe('');
});

test('renders an array of items', () => {
    const wrapper = render(<Items items={items} />);

    expect(wrapper('.gallery-item')).toHaveLength(items.length);
});

test('renders placeholder items', () => {
    const wrapper = render(<Items items={emptyData} />);

    expect(wrapper('.gallery-item[data-placeholder="true"]')).toHaveLength(
        emptyData.length
    );
});

test('has initial state', () => {
    const wrapper = shallow(<Items items={[]} />);

    expect(wrapper.state('collection')).toMatchObject(
        expect.objectContaining({ next: expect.any(Function) })
    );
    expect(wrapper.state('done')).toBe(false);
});

test('updates state after receiving props', () => {
    const wrapper = shallow(<Items items={[]} />);
    const prevCollection = wrapper.state('collection');
    const nextCollection = wrapper.setProps({ items: [] }).state('collection');

    expect(nextCollection).not.toBe(prevCollection);
    expect(nextCollection).toMatchObject(
        expect.objectContaining({ next: expect.any(Function) })
    );
    expect(wrapper.state('done')).toBe(false);
});

test('updates state after observer terminates', () => {
    const wrapper = shallow(<Items items={items} />);

    items.forEach(() => {
        expect(wrapper.state('done')).toBe(false);
        wrapper.instance().handleLoad('');
    });

    expect(wrapper.state('done')).toBe(true);
});

test('updates state even when handling errors', () => {
    const wrapper = shallow(<Items items={items} />);

    items.forEach(() => {
        expect(wrapper.state('done')).toBe(false);
        wrapper.instance().handleError('');
    });

    expect(wrapper.state('done')).toBe(true);
});
