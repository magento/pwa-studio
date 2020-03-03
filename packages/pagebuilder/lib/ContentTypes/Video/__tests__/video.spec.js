import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Video from '../video';

test('renders an empty Video component', () => {
    const component = createTestInstance(<Video />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Video component', () => {
    const videoProps = {
        url: 'https://www.youtube.com/watch?v=N0bYol6ax8Y'
    };
    const component = createTestInstance(<Video {...videoProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Video component with all props configured', () => {
    const videoProps = {
        url: 'https://vimeo.com/116810486',
        maxWidth: '500px',
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
    const component = createTestInstance(<Video {...videoProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Video component with all props configured for local video', () => {
    const videoProps = {
        url: 'https://example.com/video.mp4',
        muted: true,
        autoplay: true,
        maxWidth: '500px',
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
    const component = createTestInstance(<Video {...videoProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
