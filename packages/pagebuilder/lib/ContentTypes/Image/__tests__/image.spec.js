import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Image from '../image';

jest.mock('@magento/peregrine/lib/util/makeUrl');

jest.mock('@magento/venia-ui/lib/classify');

test('renders an empty Image component', () => {
    const component = createTestInstance(<Image />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Image component', () => {
    const imageProps = {
        desktopImage: { src: 'test-image.png' }
    };
    const component = createTestInstance(<Image {...imageProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Image component with all props configured', () => {
    const imageProps = {
        desktopImage: { src: 'desktop-image.png' },
        mobileImage: { src: 'mobile-image.png' },
        altText: 'Alt Text',
        title: 'Title Text',
        link: 'http://www.adobe.com/',
        linkType: 'default',
        openInNewTab: true,
        caption: 'Example Caption',
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
    const component = createTestInstance(<Image {...imageProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Image component with openInNewTab set to false', () => {
    const imageProps = {
        desktopImage: { src: 'desktop-image.png' },
        link: 'http://www.adobe.com/',
        linkType: 'default',
        openInNewTab: false
    };
    const component = createTestInstance(<Image {...imageProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Image component with only mobile image', () => {
    const imageProps = {
        mobileImage: { src: 'mobile-image.png' }
    };
    const component = createTestInstance(<Image {...imageProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
