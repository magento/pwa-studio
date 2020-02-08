import React from 'react';
import TestRenderer from 'react-test-renderer';
import MediaIconGroup from '../mediaIconGroup';
import {getMediaConfig} from "../../../util/getMediaConfig";

jest.mock('../../../classify');

const disabledMediaConfig = {
    enabled: false,
    links: {
        facebook: 'https://www.facebook.com',
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.twitter.com',
        youtube: 'https://www.youtube.com'
    }
};

const mediaConfig = getMediaConfig();

test('is enabled', () => {
    expect(mediaConfig.enabled).toBeTruthy();
});

test('is disabled', () => {
    expect(disabledMediaConfig.enabled).toBeFalsy();
});

test('renders correctly a media icon group', () => {
    const component = TestRenderer.create(
        <MediaIconGroup links={mediaConfig.links} />
    );

    expect(component.toJSON()).toMatchSnapshot();
});
