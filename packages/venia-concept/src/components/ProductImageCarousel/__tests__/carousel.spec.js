import React from 'react';
import testRenderer from 'react-test-renderer';
import { transparentPlaceholder } from 'src/shared/images';
import Carousel from '../carousel';

jest.mock('src/classify');

const defaultProps = {
    // This order is specifically set to test sorting/filtering. Do not modify.
    images: [
        {
            file: 'thumbnail.png',
            position: 0,
            disabled: true,
            label: 'disabled-thumbnail'
        },
        {
            file: 'thumbnail2.png',
            position: 2,
            disabled: false,
            label: 'test-thumbnail2'
        },
        {
            file: 'thumbnail1.png',
            position: 1,
            disabled: false,
            label: 'test-thumbnail1'
        },
        // These two images w/o position are required to test the sorting.
        {
            file: 'thumbnail3.png',
            disabled: false,
            label: 'test-thumbnail3'
        },
        {
            file: 'thumbnail4.png',
            disabled: false,
            label: 'test-thumbnail4'
        }
    ]
};

test('renders the Carousel component correctly w/ sorted images', () => {
    const component = testRenderer.create(<Carousel {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();

    const buttons = component.root.findAll(
        el => el.type === 'button' && el.children[0].type === 'img'
    );

    // The first button/image should be thumbnail1 according to position prop.
    expect(buttons[0].children[0].props.alt).toEqual('test-thumbnail1');
    expect(buttons[1].children[0].props.alt).toEqual('test-thumbnail2');
});

test('renders active item as main image', () => {
    const component = testRenderer.create(<Carousel {...defaultProps} />);

    const button = component.root.findByProps({ className: 'rootSelected' });
    const activeImageThumbnailAlt = button.children[0].props.alt;

    const activeImage = component.root.findAllByProps({
        className: 'currentImage'
    })[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail1');
    expect(activeImageAlt).toEqual(activeImageThumbnailAlt);
});

test('updates main image when non-active item is clicked', () => {
    const component = testRenderer.create(<Carousel {...defaultProps} />);

    // Click the second image
    component.root
        .findByProps({ alt: 'test-thumbnail2' })
        .parent.props.onClick();

    const button = component.root.findByProps({ className: 'rootSelected' });
    const activeImageThumbnailAlt = button.children[0].props.alt;

    const activeImage = component.root.findAllByProps({
        className: 'currentImage'
    })[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail2');
    expect(activeImageAlt).toEqual(activeImageThumbnailAlt);
});

test('renders prior image when left chevron is clicked', () => {
    const component = testRenderer.create(<Carousel {...defaultProps} />);

    // Click the second image to set it as active for this test.
    component.root
        .findByProps({ alt: 'test-thumbnail2' })
        .parent.props.onClick();

    const leftButton = component.root.findByProps({
        className: 'chevron-left'
    });
    leftButton.props.onClick();

    const activeImage = component.root.findAllByProps({
        className: 'currentImage'
    })[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail1');
});

test('renders last image when left chevron is clicked and first item is active', () => {
    const component = testRenderer.create(<Carousel {...defaultProps} />);

    const leftButton = component.root.findByProps({
        className: 'chevron-left'
    });
    leftButton.props.onClick();

    const activeImage = component.root.findAllByProps({
        className: 'currentImage'
    })[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail4');
});

test('renders next image when right chevron is clicked', () => {
    const component = testRenderer.create(<Carousel {...defaultProps} />);

    const leftButton = component.root.findByProps({
        className: 'chevron-right'
    });
    leftButton.props.onClick();

    const activeImage = component.root.findAllByProps({
        className: 'currentImage'
    })[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail2');
});

test('renders first image when right chevron is clicked and last item is active', () => {
    const component = testRenderer.create(<Carousel {...defaultProps} />);

    // Click the last image to set it as active for this test.
    component.root
        .findByProps({ alt: 'test-thumbnail4' })
        .parent.props.onClick();

    const leftButton = component.root.findByProps({
        className: 'chevron-right'
    });
    leftButton.props.onClick();

    const activeImage = component.root.findAllByProps({
        className: 'currentImage'
    })[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail1');
});

test('renders a transparent main image if no file name is provided', () => {
    const component = testRenderer.create(<Carousel images={[]} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('sets main image alt as "image-product" if no label is provided', () => {
    const component = testRenderer.create(<Carousel images={[]} />);

    const activeImage = component.root.findAllByProps({
        className: 'currentImage'
    })[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('image-product');
});

test('renders a placeholder until image is loaded', () => {
    const component = testRenderer.create(<Carousel {...defaultProps} />);

    const placeholderImage = component.root.findAllByProps({
        className: 'currentImage'
    })[1];
    const placeholderImageSrc = placeholderImage.props.src;

    expect(placeholderImageSrc).toEqual(transparentPlaceholder);

    component.root.children[0].instance.setCurrentImageLoaded();

    const images = component.root.findAllByProps({
        className: 'currentImage'
    });

    expect(images.length).toEqual(1);
});
