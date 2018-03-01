import ReactDOM from 'react-dom';
import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Peregrine from '..';

jest.mock('react-dom');

configure({ adapter: new Adapter() });

beforeAll(() => {
    for (const method of Object.keys(console)) {
        jest.spyOn(console, method).mockImplementation(() => {});
    }
});

afterAll(() => {
    for (const method of Object.values(console)) {
        method.mockRestore();
    }
});

test('Constructs a new Peregrine instance', () => {
    const received = new Peregrine();

    expect(received).toMatchObject(
        expect.objectContaining({
            store: expect.objectContaining({
                dispatch: expect.any(Function),
                getState: expect.any(Function)
            })
        })
    );
});

test('Renders a Peregrine instance', () => {
    const app = new Peregrine();
    const wrapper = shallow(app.render());
    expect(wrapper.find('MagentoRouter')).toHaveLength(1);
});

test('Mounts a Peregrine instance', () => {
    const container = document.createElement('div');
    const received = new Peregrine();

    received.mount(container);
    expect(ReactDOM.render).toHaveBeenCalledWith(expect.anything(), container);
});

test('Adds a reducer to the store', () => {
    const expected = {};
    const app = new Peregrine();
    const fooReducer = (state = null, { type }) =>
        type === 'bar' ? expected : state;

    app.addReducer('foo', fooReducer);
    const received = app.store.getState().foo;
    expect(received).toBe(null);

    app.store.dispatch({ type: 'bar' });
    const next = app.store.getState().foo;
    expect(next).toBe(expected);
});
