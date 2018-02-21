import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Gallery from '../gallery';

configure({ adapter: new Adapter() });

const items = [{ key: 'a' }, { key: 'b' }];

test('renders if `data` is an empty array', () => {
    const wrapper = shallow(<Gallery data={[]} />);

    expect(wrapper.hasClass('gallery')).toBe(true);
});

test('renders if `data` is an array of objects', () => {
    const wrapper = shallow(<Gallery data={items} />);

    expect(wrapper.hasClass('gallery')).toBe(true);
});
