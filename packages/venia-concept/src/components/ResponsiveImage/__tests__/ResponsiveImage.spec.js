import React from 'react';
import TestRenderer from 'react-test-renderer';

import ResponsiveImage from '../';

class ErrorBoundary extends React.Component {
    static getDerivedStateFromError({ message }) {
        return { message };
    }
    render() {
        if (this.state && this.state.message) {
            return <h1>{this.state.message}</h1>;
        }
        return this.props.children;
    }
}

test('renders an img tag when no render prop is passed', () => {
    const testRenderer = TestRenderer.create(
        <ResponsiveImage
            alt="An image"
            className="foo-class"
            sizes="80vw"
            src="/a/product/img.jpg"
            type="product"
            widthOptions={[160, 480, 1024, 800]}
        />
    );
    const img = testRenderer.root.findByType('img');
    expect(img).toBeTruthy();
    expect(img.props).toMatchObject({
        alt: 'An image',
        className: 'foo-class',
        sizes: '80vw',
        src: '/resize/160w/media/catalog/product/a/product/img.jpg',
        srcSet:
            '/resize/160w/media/catalog/product/a/product/img.jpg 160w, /resize/480w/media/catalog/product/a/product/img.jpg 480w, /resize/1024w/media/catalog/product/a/product/img.jpg 1024w, /resize/800w/media/catalog/product/a/product/img.jpg 800w'
    });
});

test('appends the smallest widthOption as a `sizes` fallback value when appropriate', () => {
    const testRenderer = TestRenderer.create(
        <ResponsiveImage
            alt="An image"
            className="foo-class"
            sizes="(max-width: 240px) 80vw"
            src="/a/product/img.jpg"
            type="product"
            widthOptions={[160, 480, 1024, 800]}
        />
    );
    expect(
        testRenderer.root.findByProps({
            sizes: '(max-width: 240px) 80vw, 160px'
        })
    ).toBeTruthy();
});

test('passes along arbitrary properties', () => {
    const testRenderer = TestRenderer.create(
        <ResponsiveImage
            alt="An image"
            className="foo-class"
            sizes="(max-width: 240px) 80vw"
            src="/a/product/img.jpg"
            type="product"
            title="Hover over me!"
            widthOptions={[160, 480, 1024, 800]}
        />
    );
    expect(
        testRenderer.root.findByProps({
            title: 'Hover over me!'
        })
    ).toBeTruthy();
});

test('passes renderImage() to a render function', () => {
    const testRenderer = TestRenderer.create(
        <ResponsiveImage
            alt="An image property set"
            className="bar-class"
            sizes="(max-width: 240px) 80vw"
            src="/c/cat.jpg"
            type="category"
            widthOptions={[480, 1024, 800]}
            render={renderImage => (
                <span className="a-span">{renderImage()}</span>
            )}
        />
    );
    const span = testRenderer.root.findByType('span');
    expect(span).toBeTruthy();
    expect(span.props).toMatchObject({
        className: 'a-span'
    });
    expect(span.findByType('img')).toBeTruthy();
});

test('throws an error if renderImage() is never called during render', () => {
    const testRenderer = TestRenderer.create(
        <ErrorBoundary>
            <ResponsiveImage
                alt="An image property set"
                className="bar-class"
                sizes="(max-width: 240px) 80vw"
                src="/c/cat.jpg"
                type="category"
                widthOptions={[480, 1024, 800]}
                render={() => <span />}
            />
        </ErrorBoundary>
    );
    const h1 = testRenderer.root.findByType('h1');
    expect(h1).toBeTruthy();
    expect(h1.props.children).toMatch(/rendered image was not used/);
});

test('throws an error if setToUrl() is called with an unrecognized arg', () => {
    const testRenderer = TestRenderer.create(
        <ErrorBoundary>
            <ResponsiveImage
                alt="An image property set"
                className="bar-class"
                sizes="(max-width: 240px) 80vw"
                src="/c/cat.jpg"
                type="category"
                widthOptions={[480, 1024, 800]}
                render={(renderImage, setToUrl) => (
                    <span ref={setToUrl()}>{renderImage}</span>
                )}
            />
        </ErrorBoundary>
    );
    const h1 = testRenderer.root.findByType('h1');
    expect(h1).toBeTruthy();
    expect(h1.props.children).toMatch(
        /Argument.*must be a function.*or a string/
    );
});

test("passes a ref factory to the render function which updates an element's style attribute when the image loads", () => {
    const fakeSpan = {
        setAttribute: jest.fn(),
        getAttribute: jest.fn()
    };
    const ref = React.createRef();
    const testRenderer = TestRenderer.create(
        <ResponsiveImage
            alt="An image property set"
            className="bar-class"
            ref={ref}
            sizes="(max-width: 240px) 80vw, (max-width: 640px) 50vw"
            src="/c/cat.jpg"
            type="category"
            widthOptions={[480, 1024, 800]}
            render={(renderImage, setToUrl) => (
                <span ref={setToUrl('background-image')}>{renderImage()}</span>
            )}
        />,
        {
            createNodeMock(element) {
                return element.type === 'span' ? fakeSpan : element;
            }
        }
    );
    const span = testRenderer.root.findByType('span');
    // simulate a brand new src to set a new style attribute
    ref.current.handleLoad({
        target: {
            currentSrc: 'https://new/image'
        }
    });
    expect(fakeSpan.getAttribute).toHaveBeenCalledTimes(1);
    expect(fakeSpan.getAttribute).toHaveBeenCalledWith('style');
    expect(fakeSpan.setAttribute).toHaveBeenCalledTimes(1);
    expect(fakeSpan.setAttribute).toHaveBeenCalledWith(
        'style',
        'background-image: url("https://new/image")'
    );

    // simulate a replacement src to string splice the style attribute
    fakeSpan.getAttribute.mockReturnValueOnce(
        'background-size:cover;background-image:url(blorf.jpg);color:white'
    );
    ref.current.handleLoad({
        target: {
            currentSrc: 'https://replacement/image'
        }
    });
    expect(fakeSpan.getAttribute).toHaveBeenCalledTimes(2);
    expect(fakeSpan.setAttribute).toHaveBeenCalledTimes(2);
    expect(fakeSpan.setAttribute).toHaveBeenLastCalledWith(
        'style',
        'background-size:cover;background-image: url("https://replacement/image");color:white'
    );
});

test('passes a ref factory to the render function which takes a callback receiving element and new src', () => {
    const fakeSpan = {
        appendChild: jest.fn()
    };
    const ref = React.createRef();
    const testRenderer = TestRenderer.create(
        <ResponsiveImage
            alt="An image property set"
            className="bar-class"
            ref={ref}
            sizes="(max-width: 240px) 80vw, (max-width: 640px) 50vw"
            src="/c/cat.jpg"
            type="category"
            widthOptions={[480, 1024, 800]}
            render={(renderImage, setToUrl) => (
                <span
                    ref={setToUrl((element, currentSrc) =>
                        element.appendChild(currentSrc)
                    )}
                >
                    {renderImage()}
                </span>
            )}
        />,
        {
            createNodeMock(element) {
                return element.type === 'span' ? fakeSpan : element;
            }
        }
    );
    const span = testRenderer.root.findByType('span');
    // simulate a new src
    ref.current.handleLoad({
        target: {
            currentSrc: 'https://new/image'
        }
    });
    expect(fakeSpan.appendChild).toHaveBeenCalledTimes(1);
    expect(fakeSpan.appendChild).toHaveBeenCalledWith('https://new/image');
});
