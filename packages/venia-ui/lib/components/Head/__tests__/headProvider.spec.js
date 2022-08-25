import React from 'react';
import TestRenderer from 'react-test-renderer';

import { HeadProvider, Title, Link, Meta, Style } from '../';

test('HeadProvider should keep existing title tags if any', () => {
    document.head.appendChild(document.createElement('title'));

    expect(document.getElementsByTagName('title').length).toBe(1);

    TestRenderer.create(<HeadProvider />).root;

    expect(document.getElementsByTagName('title').length).toBe(1);
});

test('HeadProvider should render title', () => {
    const newTitle = 'New Title';
    TestRenderer.create(
        <HeadProvider>
            <Title>{newTitle}</Title>
        </HeadProvider>
    );

    expect(document.getElementsByTagName('title').length).toBe(1);
    expect(document.getElementsByTagName('title')[0].innerHTML).toBe(newTitle);
});

test('HeadProvider should replace all previous title tags with the latest tag', () => {
    const oldTitle = 'Old Title';
    const newTitle = 'New Title';
    TestRenderer.create(
        <HeadProvider>
            <Title>{oldTitle}</Title>
            <Title>{newTitle}</Title>
        </HeadProvider>
    ).root;

    expect(document.getElementsByTagName('title').length).toBe(1);
    expect(document.getElementsByTagName('title')[0].innerHTML).toBe(newTitle);
});

test('HeadProvider should be able to render multiple meta tags', () => {
    expect(document.getElementsByTagName('meta').length).toBe(0);

    TestRenderer.create(
        <HeadProvider>
            <Meta name="title" content="Sample Title" />
            <Meta name="description" content="Sample Description" />
            <Meta name="keywords" content="Sample Keywords" />
        </HeadProvider>
    );

    expect(document.getElementsByTagName('meta').length).toBe(3);
});

test('HeadProvider should be able to render multiple link tags', () => {
    expect(document.getElementsByTagName('link').length).toBe(0);

    TestRenderer.create(
        <HeadProvider>
            <Link rel="manifest" href="/manifest.json" />
            <Link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/icons/apple-touch-icon.png"
            />
            <Link rel="stylesheet" href="styles.css" />
        </HeadProvider>
    );

    expect(document.getElementsByTagName('link').length).toBe(3);
});

test('HeadProvider should be able to render multiple style tags', () => {
    expect(document.getElementsByTagName('style').length).toBe(0);

    const firstStyleContent = `.icon {
        align-items: center;
        display: inline-flex;
        justify-content: center;
    }`;

    const secondStyleContent = `.button {
        color: green;
    }`;
    TestRenderer.create(
        <HeadProvider>
            <Style type="text/css">{firstStyleContent}</Style>
            <Style type="text/css">{secondStyleContent}</Style>
        </HeadProvider>
    );

    expect(document.getElementsByTagName('style').length).toBe(2);
});
