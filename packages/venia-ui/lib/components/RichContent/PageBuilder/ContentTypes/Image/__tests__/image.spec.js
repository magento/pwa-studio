import React from 'react';
import testRenderer from 'react-test-renderer';
import Image from '../image';

jest.mock('../../../../../../classify');

test('renders a Image component', () => {
    const imageProps = {
        desktopImage: 'test-image.png'
    };
    const component = testRenderer.create(<Image {...imageProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Image component with all props configured', () => {
    const imageProps = {
        desktopImage: 'desktop-image.png',
        mobileImage: 'mobile-image.png',
        altText: 'Alt Text',
        title: 'Title Text',
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
    const component = testRenderer.create(<Image {...imageProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
