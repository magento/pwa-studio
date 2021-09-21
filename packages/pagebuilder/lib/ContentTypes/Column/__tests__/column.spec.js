import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Column from '../column';

jest.mock('@magento/peregrine/lib/util/makeUrl');

test('renders a Column component', () => {
    const component = createTestInstance(<Column />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Column with appearance align bottom', () => {
    const columnProps = {
        appearance: 'align-bottom'
    };
    const component = createTestInstance(<Column {...columnProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Column component with all props configured', () => {
    const columnProps = {
        appearance: 'full-height',
        backgroundAttachment: 'scroll',
        backgroundColor: 'rgb(193, 193, 193)',
        backgroundPosition: 'left top',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        border: 'solid',
        borderColor: 'rgb(0, 0, 0)',
        borderRadius: '10px',
        borderWidth: '1px',
        cssClasses: ['test-class'],
        desktopImage: 'image-desktop.png',
        display: 'flex',
        marginBottom: '10px',
        marginLeft: '10px',
        marginRight: '10px',
        marginTop: '10px',
        minHeight: '300px',
        mobileImage: 'image-mobile.png',
        paddingBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        paddingTop: '10px',
        textAlign: 'center',
        verticalAlignment: 'top',
        width: 'calc((100% / 3) - 20px)'
    };
    const component = createTestInstance(<Column {...columnProps} />, {
        createNodeMock: () => {
            return {
                offsetWidth: 250,
                offsetHeight: 250
            };
        }
    });

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Column component for mobile screen with mobileImage set', () => {
    matchMedia.mockImplementation(query => {
        return {
            matches: true,
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        };
    });

    const columnProps = {
        appearance: 'align-top',
        desktopImage: 'image-desktop.png',
        mobileImage: 'image-mobile.png',
        verticalAlignment: 'middle'
    };
    const component = createTestInstance(<Column {...columnProps} />, {
        createNodeMock: () => {
            return {
                offsetWidth: 250,
                offsetHeight: 250
            };
        }
    });

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Column component for mobile screen without mobileImage set', () => {
    matchMedia.mockImplementation(query => {
        return {
            matches: true,
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        };
    });

    const columnProps = {
        appearance: 'align-center',
        desktopImage: 'image-desktop.png',
        verticalAlignment: 'bottom'
    };
    const component = createTestInstance(<Column {...columnProps} />, {
        createNodeMock: () => {
            return {
                offsetWidth: 250,
                offsetHeight: 250
            };
        }
    });

    expect(component.toJSON()).toMatchSnapshot();
});
