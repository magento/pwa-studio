import React from 'react';
import { act } from 'react-test-renderer';
import Carousel from '../carousel';
import Image from '../../Image';
import {
    WindowSizeContextProvider,
    createTestInstance
} from '@magento/peregrine';

jest.mock('../../../classify');

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
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <Carousel {...defaultProps} />
        </WindowSizeContextProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a transparent main image if no file name is provided', () => {
    const component = createTestInstance(<Carousel images={[]} />);
    expect(component.toJSON()).toMatchSnapshot();
});

test('renders active item as main image', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <Carousel {...defaultProps} />
        </WindowSizeContextProvider>
    );

    const button = component.root.findByProps({ className: 'rootSelected' });
    const activeImageThumbnailAlt = button.children[0].props.alt;

    const activeImage = component.root.findAllByType(Image)[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail1');
    expect(activeImageAlt).toEqual(activeImageThumbnailAlt);
});

test('updates main image when non-active item is clicked', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <Carousel {...defaultProps} />
        </WindowSizeContextProvider>
    );

    // Click the second image
    act(() => {
        component.root
            .findByProps({ alt: 'test-thumbnail2' })
            .parent.props.onClick();
    });

    const button = component.root.findByProps({ className: 'rootSelected' });
    const activeImageThumbnailAlt = button.children[0].props.alt;

    const activeImage = component.root.findAllByType(Image)[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail2');
    expect(activeImageAlt).toEqual(activeImageThumbnailAlt);
});

test('renders prior image when previous button is clicked', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <Carousel {...defaultProps} />
        </WindowSizeContextProvider>
    );

    // Click the second image to set it as active for this test.
    act(() => {
        component.root
            .findByProps({ alt: 'test-thumbnail2' })
            .parent.props.onClick();
    });

    const leftButton = component.root.findAllByProps({
        className: 'previousButton'
    })[0];

    act(() => {
        leftButton.props.onPress();
    });

    const activeImage = component.root.findAllByType(Image)[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail1');
});

test('renders last image when previous button is clicked and first item is active', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <Carousel {...defaultProps} />
        </WindowSizeContextProvider>
    );

    const leftButton = component.root.findAllByProps({
        className: 'previousButton'
    })[0];

    act(() => {
        leftButton.props.onPress();
    });

    const activeImage = component.root.findAllByType(Image)[4];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail4');
});

test('renders next image when next Button is clicked', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <Carousel {...defaultProps} />
        </WindowSizeContextProvider>
    );

    const rightButton = component.root.findAllByProps({
        className: 'nextButton'
    })[0];

    act(() => {
        rightButton.props.onPress();
    });

    const activeImage = component.root.findAllByType(Image)[0];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail2');
});

test('renders first image when next Button is clicked and last item is active', () => {
    const component = createTestInstance(
        <WindowSizeContextProvider>
            <Carousel {...defaultProps} />
        </WindowSizeContextProvider>
    );

    // Click the last image to set it as active for this test.
    act(() => {
        component.root
            .findByProps({ alt: 'test-thumbnail4' })
            .parent.props.onClick();
    });

    const rightButton = component.root.findAllByProps({
        className: 'nextButton'
    })[0];

    act(() => {
        rightButton.props.onPress();
    });

    const activeImage = component.root.findAllByType(Image)[1];
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('test-thumbnail1');
});

test('sets main image alt as "image-product" if no label is provided', () => {
    const component = createTestInstance(<Carousel images={[]} />);

    const activeImage = component.root.findByType(Image);
    const activeImageAlt = activeImage.props.alt;

    expect(activeImageAlt).toEqual('image-product');
});
