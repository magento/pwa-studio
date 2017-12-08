import { createElement } from 'react';
import { connect } from 'react-redux';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Peregrine from './index.js';

configure({ adapter: new Adapter() });

test('renders a single child transparently', () => {
    const child = <i />;
    const unit = <Peregrine>{child}</Peregrine>;

    expect(shallow(unit).html()).toEqual(shallow(child).html());
});

test('renders multiple children transparently', () => {
    const children = [<i key="a" />, <i key="b" />];
    const unit = <Peregrine>{children}</Peregrine>;
    const expected = <div>{children}</div>;

    expect(shallow(unit).html()).toEqual(
        shallow(expected)
            .children()
            .reduce((value, node) => value + node.html(), '')
    );
});
