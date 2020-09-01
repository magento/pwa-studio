import React, { Fragment } from 'react';
import { shallow } from 'enzyme';
import Price from '../price';
import IntlPolyfill from 'intl';
import areIntlLocalesSupported from 'intl-locales-supported';

if (global.Intl.NumberFormat.prototype.formatToParts) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported('fr-FR')) {
        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and patch the constructors we need with the polyfill's.
        //global.Intl = IntlPolyfill;
        Intl.NumberFormat = IntlPolyfill.NumberFormat;
    }
} else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = IntlPolyfill;
    require('intl/locale-data/jsonp/en.js');
    require('intl/locale-data/jsonp/fr-FR.js');
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

test('Renders a EUR price with locale set to French', () => {
    const wrapper = shallow(
        <Price value={1000.99} currencyCode="EUR" locale="fr-FR" />
    );
    expect(
        wrapper.equals(
            <Fragment>
                <span>1</span>
                <span>&nbsp;</span>
                <span>000</span>
                <span>,</span>
                <span>99</span>
                <span>&nbsp;</span>
                <span>€</span>
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
