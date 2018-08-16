import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider as ReduxProvider } from 'react-redux';
import MagentoRouter from '../../Router';
import bootstrap from '..';

configure({ adapter: new Adapter() });

beforeAll(() => {
    for (const [methodName, method] of Object.entries(console)) {
        if (typeof method === 'function') {
            jest.spyOn(console, methodName).mockImplementation(() => {});
        }
    }
});

afterAll(() => {
    for (const method of Object.values(console)) {
        if (typeof method === 'function') {
            method.mockRestore();
        }
    }
});

test('Throws descriptive error when using former API', () => {
    const fn = () => new bootstrap({});
    expect(fn).toThrowError(/The API for Peregrine has changed/);
});

test('Exposes the Redux store', () => {
    const { store } = bootstrap({
        apiBase: '/graphql',
        __tmp_webpack_public_path__: 'foobar'
    });
    expect(store).toMatchObject({
        dispatch: expect.any(Function),
        getState: expect.any(Function),
        addReducer: expect.any(Function)
    });
});

test('Provider includes Redux + Router', () => {
    const { Provider } = bootstrap({
        apiBase: '/graphql',
        __tmp_webpack_public_path__: 'foobar',
        CustomRouter: MagentoRouter
    });
    const wrapper = shallow(<Provider />);
    expect(wrapper.find(ReduxProvider).length).toBe(1);
    expect(wrapper.find(MagentoRouter).length).toBe(1);
});
