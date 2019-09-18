import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Row from '../row';

jest.mock('../../../../../../classify');

test('render row with no props', () => {
    const component = createTestInstance(<Row />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render row with all props configured', () => {
    const rowProps = {
        appearance: 'full-width',
        verticalAlignment: 'middle',
        minHeight: '200px',
        backgroundColor: 'red',
        desktopImage: 'desktop.jpg',
        mobileImage: 'mobile.jpg',
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: true,
        enableParallax: false,
        parallaxSpeed: 0.5,
        textAlign: 'right',
        border: 'solid',
        borderColor: 'red',
        borderWidth: '10px',
        borderRadius: '15px',
        marginTop: '10px',
        marginRight: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        cssClasses: ['test-class']
    };
    const component = createTestInstance(<Row {...rowProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render row with mobile image displayed and parallax enabled', () => {
    const rowProps = {
        mobileImage: 'mobile.jpg',
        enableParallax: true,
    };

    window.matchMedia = jest.fn().mockImplementation(query => {
        return {
            matches: true,
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        };
    });

    const component = createTestInstance(<Row {...rowProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
