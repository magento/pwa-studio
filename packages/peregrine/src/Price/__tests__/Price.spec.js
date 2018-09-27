import React, { Fragment } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Price from '../Price';
import IntlPolyfill from 'intl';

configure({ adapter: new Adapter() });

if (!global.Intl.NumberFormat.prototype.formatToParts) {
    global.Intl = IntlPolyfill;
    require('intl/locale-data/jsonp/en.js');
}

test('Renders a USD price', () => {
    const wrapper = shallow(<Price value={100.99} currencyCode="USD" />);
    expect(
        wrapper.equals(
            <Fragment>
                <span>$</span>
                <span>100</span>
                <span>.</span>
                <span>99</span>
            </Fragment>
        )
    ).toBe(true);
});

test('Renders a EUR price', () => {
    const wrapper = shallow(<Price value={100.99} currencyCode="EUR" />);
    expect(
        wrapper.equals(
            <Fragment>
                <span>€</span>
                <span>100</span>
                <span>.</span>
                <span>99</span>
            </Fragment>
        )
    ).toBe(true);
});

test('Allows custom classnames for each part', () => {
    const classes = {
        currency: 'curr',
        integer: 'int',
        decimal: 'dec',
        fraction: 'fract'
    };
    const wrapper = shallow(
        <Price value={88.81} currencyCode="USD" classes={classes} />
    );
    expect(
        wrapper.equals(
            <Fragment>
                <span className="curr">$</span>
                <span className="int">88</span>
                <span className="dec">.</span>
                <span className="fract">81</span>
            </Fragment>
        )
    ).toBe(true);
});
