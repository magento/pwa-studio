import { createElement } from 'react';
import ContainerChild from '..';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

test('Console warning when ContainerChild was not processed by buildpack', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    shallow(<ContainerChild id="foo.bar" render={() => {}} />);
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('not preprocessed')
    );
    console.warn.mockRestore();
});

test('No console warning when ContainerChild was processed by buildpack', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    shallow(<ContainerChild id="foo.bar" render={() => {}} processed={true} />);
    expect(console.warn).not.toHaveBeenCalled();
    console.warn.mockRestore();
});

test('Renders content from render prop', () => {
    const wrapper = shallow(
        <ContainerChild
            id="foo.bar"
            render={() => <div>Hello World</div>}
            processed={true}
        />
    );
    expect(wrapper.equals(<div>Hello World</div>)).toBe(true);
});
