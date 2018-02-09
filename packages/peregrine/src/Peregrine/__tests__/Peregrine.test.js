import { createElement } from 'react';
import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Peregrine from '..';

configure({ adapter: new Adapter() });

const SimpleComponent = () => <i />;

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
    const received = new Peregrine(SimpleComponent);

    expect(received).toMatchObject(
        expect.objectContaining({
            component: SimpleComponent,
            store: expect.objectContaining({
                dispatch: expect.any(Function),
                getState: expect.any(Function)
            })
        })
    );
});

test('Renders a Peregrine instance', () => {
    const app = new Peregrine(SimpleComponent);
    const received = app.render();
    const expected = <SimpleComponent />;

    expect(render(received)).toEqual(render(expected));
});

test('Mounts a Peregrine instance', () => {
    const container = document.createElement('div');
    const received = new Peregrine(SimpleComponent);
    const expected = <SimpleComponent />;

    received.mount(container);

    expect(received.container).toEqual(container);
    expect(render(received.element)).toEqual(render(expected));
    expect(container.firstChild.outerHTML).toEqual(render(expected).toString());
});

test('Adds a reducer to the store', () => {
    const expected = {};
    const app = new Peregrine(SimpleComponent);
    const fooReducer = (state = null, { type }) =>
        type === 'bar' ? expected : state;

    app.addReducer('foo', fooReducer);
    const received = app.store.getState().foo;
    expect(received).toBe(null);

    app.store.dispatch({ type: 'bar' });
    const next = app.store.getState().foo;
    expect(next).toBe(expected);
});
