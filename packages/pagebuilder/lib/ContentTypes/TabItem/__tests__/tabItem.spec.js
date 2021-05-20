import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import TabItem from '../tabItem';

jest.mock('@magento/peregrine/lib/util/makeUrl');

test('render tab item with no props', () => {
    const component = createTestInstance(<TabItem />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render tab item with all props configured', () => {
    const tabItemProps = {
        verticalAlignment: 'middle',
        minHeight: '200px',
        backgroundColor: 'red',
        desktopImage: 'desktop.jpg',
        mobileImage: 'mobile.jpg',
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: true,
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
    const component = createTestInstance(<TabItem {...tabItemProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render tab item with mobile image displayed', () => {
    const tabItemProps = {
        mobileImage: 'mobile.jpg'
    };

    matchMedia.mockImplementation(query => {
        return {
            matches: true,
            media: query
        };
    });

    const component = createTestInstance(<TabItem {...tabItemProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
