import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';

import { HeadProvider, Title, Link, Meta, Style } from '../';

beforeAll(() => {
    ReactDOM.createPortal = jest.fn(element => {
        return element;
    });
});

afterEach(() => {
    ReactDOM.createPortal.mockClear();
});

test('HeadProvider should delete all title tags if any', () => {
    document.head.appendChild(document.createElement('title'));

    expect(document.getElementsByTagName('title').length).toBe(1);

    const instance = TestRenderer.create(<HeadProvider />).root;

    expect(instance.findAllByType('title').length).toBe(0);
});

test('HeadProvider should render title', () => {
    const newTitle = 'New Title';
    const instance = TestRenderer.create(
        <HeadProvider>
            <Title>{newTitle}</Title>
        </HeadProvider>
    ).root;

    expect(instance.findAllByType('title').length).toBe(1);
    expect(instance.findByType('title').props.children).toBe(newTitle);
});

test('HeadProvider should replace all previous title tags with the latest tag', () => {
    const oldTitle = 'Old Title';
    const newTitle = 'New Title';
    const instance = TestRenderer.create(
        <HeadProvider>
            <Title>{oldTitle}</Title>
            <Title>{newTitle}</Title>
        </HeadProvider>
    ).root;

    expect(instance.findAllByType('title').length).toBe(1);
    expect(instance.findByType('title').props.children).toBe(newTitle);
});

test('HeadProvider should be able to render multiple meta tags', () => {
    expect(document.getElementsByTagName('meta').length).toBe(0);

    const instance = TestRenderer.create(
        <HeadProvider>
            <Meta name="title" content="Sample Title" />
            <Meta name="description" content="Sample Description" />
            <Meta name="keywords" content="Sample Keywords" />
        </HeadProvider>
    ).root;

    expect(instance.findAllByType('meta').length).toBe(3);
});

test('HeadProvider should be able to render multiple link tags', () => {
    expect(document.getElementsByTagName('link').length).toBe(0);

    const instance = TestRenderer.create(
        <HeadProvider>
            <Link rel="manifest" href="/manifest.json" />
            <Link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/icons/apple-touch-icon.png"
            />
            <Link rel="stylesheet" href="styles.css" />
        </HeadProvider>
    ).root;

    expect(instance.findAllByType('link').length).toBe(3);
});

test('HeadProvider should be able to render multiple style tags', () => {
    expect(document.getElementsByTagName('style').length).toBe(0);

    const instance = TestRenderer.create(
        <HeadProvider>
            <Style type="text/css">
                {`.icon {
                    align-items: center;
                    display: inline-flex;
                    justify-content: center;
                }`}
            </Style>
            <Style type="text/css">
                {`.button {
                    color: green;
                }`}
            </Style>
        </HeadProvider>
    ).root;

    expect(instance.findAllByType('style').length).toBe(2);
});
