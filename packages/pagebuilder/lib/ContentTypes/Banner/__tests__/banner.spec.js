import React from 'react';
import { Link } from 'react-router-dom';
import { createTestInstance } from '@magento/peregrine';
import Banner from '../banner';
import { act } from 'react-test-renderer';

jest.mock('react-router-dom', () => ({
    Link: jest.fn(() => null),
    withRouter: jest.fn(arg => arg),
    useHistory: jest.fn()
}));

jest.mock('@magento/peregrine/lib/util/makeUrl');

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('jarallax', () => {
    return {
        jarallax: jest.fn(),
        jarallaxVideo: jest.fn()
    };
});
import { jarallax, jarallaxVideo } from 'jarallax';
const mockJarallax = jarallax.mockImplementation(() => {});
const mockJarallaxVideo = jarallaxVideo.mockImplementation(() => {});

jest.mock('../../../handleHtmlContentClick');
import handleHtmlContentClick from '../../../handleHtmlContentClick';

test('renders an empty Banner component', () => {
    const component = createTestInstance(<Banner />);

    expect(component.toJSON()).toMatchSnapshot();
});

// Skipping this test because the CI keeps failing but test passes locally
test.skip('renders a configured poster Banner component', () => {
    const bannerProps = {
        appearance: 'poster',
        backgroundColor: 'blue',
        backgroundAttachment: 'scroll',
        backgroundPosition: 'center center',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        border: 'solid',
        borderColor: 'rgb(0,0,0)',
        borderRadius: '15px',
        borderWidth: '1px',
        buttonText: 'Shop Bags',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        cssClasses: [],
        desktopImage: 'desktop-image.jpg',
        link: 'gear/bags.html',
        linkType: 'category',
        openInNewTab: true,
        marginBottom: '1px',
        marginLeft: '2px',
        marginRight: '3px',
        marginTop: '4px',
        minHeight: '300px',
        mobileImage: 'mobile-image.jpg',
        overlayColor: 'rgb(0,0,0,0.5)',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '40px',
        showButton: 'always',
        showOverlay: 'hover',
        textAlign: 'right'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

// Skipping this test because the CI keeps failing but test passes locally
test.skip('renders a configured collage-left Banner component', () => {
    const bannerProps = {
        appearance: 'collage-left',
        backgroundColor: 'blue',
        backgroundAttachment: 'scroll',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        border: 'solid',
        borderColor: 'rgb(0,0,0)',
        borderRadius: '15px',
        borderWidth: '1px',
        buttonText: 'Shop Bags',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        cssClasses: [],
        desktopImage: 'desktop-image.jpg',
        link: 'gear/bags.html',
        linkType: 'category',
        openInNewTab: false,
        marginBottom: '1px',
        marginLeft: '2px',
        marginRight: '3px',
        marginTop: '4px',
        minHeight: '300px',
        mobileImage: 'mobile-image.jpg',
        overlayColor: 'rgb(0,0,0,0.5)',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '40px',
        showButton: 'hover',
        showOverlay: 'always',
        textAlign: 'right'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a configured collage-left Banner component on mobile', () => {
    matchMedia.mockImplementation(() => {
        return {
            matches: true
        };
    });

    const bannerProps = {
        appearance: 'collage-left',
        backgroundColor: 'blue',
        backgroundAttachment: 'scroll',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        border: 'solid',
        borderColor: 'rgb(0,0,0)',
        borderRadius: '15px',
        borderWidth: '1px',
        buttonText: 'Shop Bags',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        cssClasses: [],
        desktopImage: 'desktop-image.jpg',
        link: 'https://www.adobe.com',
        linkType: 'default',
        openInNewTab: true,
        marginBottom: '1px',
        marginLeft: '2px',
        marginRight: '3px',
        marginTop: '4px',
        minHeight: '300px',
        mobileImage: 'mobile-image.jpg',
        overlayColor: 'rgb(0,0,0,0.5)',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '40px',
        showButton: 'hover',
        showOverlay: 'never',
        textAlign: 'right'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('on hover displays button and overlay', () => {
    const bannerProps = {
        appearance: 'collage-left',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        link: 'https://www.adobe.com',
        linkType: 'default',
        openInNewTab: false,
        overlayColor: 'rgb(0,0,0,0.5)',
        showButton: 'hover',
        showOverlay: 'hover'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);
    act(() => {
        component.toTree().rendered.props.onMouseEnter();
    });
    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component.toTree().rendered.props.onMouseLeave();
    });
    expect(component.toJSON()).toMatchSnapshot();
});

test('on click calls the HTML content click handler', () => {
    const bannerProps = {
        appearance: 'collage-left',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        link: 'https://www.adobe.com',
        linkType: 'default',
        openInNewTab: false,
        overlayColor: 'rgb(0,0,0,0.5)',
        showButton: 'hover',
        showOverlay: 'hover'
    };

    const mockHtmlContentClick = jest.fn();
    handleHtmlContentClick.mockImplementation(mockHtmlContentClick);

    const event = {
        target: {
            tagName: 'P'
        },
        preventDefault: jest.fn()
    };

    const component = createTestInstance(<Banner {...bannerProps} />);

    const htmlElement = component.root.find(instance => {
        return instance.props.dangerouslySetInnerHTML;
    });

    htmlElement.props.onClick(event);

    expect(mockHtmlContentClick).toHaveBeenCalled();
});

test('generates an internal <Link /> when URL is internal', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';
    const bannerProps = {
        link: 'http://magento.com/test-product.html',
        linkType: 'product',
        openInNewTab: false,
        showButton: 'always',
        buttonText: 'Shop Bags',
        buttonType: 'primary'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);
    const button = component.root.findByType(Link);
    expect(button.props.to).toEqual('/test-product.html');
});

test('dragging is prevented on banner link', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';
    const bannerProps = {
        link: 'http://magento.com/test-product.html',
        linkType: 'product',
        openInNewTab: false,
        showButton: 'always',
        buttonText: 'Shop Bags',
        buttonType: 'primary'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);
    const button = component.root.findByType(Link);
    const event = {
        preventDefault: jest.fn()
    };
    button.props.onDragStart(event);
    expect(event.preventDefault).toHaveBeenCalled();
});

test('render banner with parallax initializes JarallaxVideo', () => {
    const bannerProps = {
        backgroundType: 'video',
        videoFallbackSrc: 'parallax.jpg',
        videoLazyLoading: true,
        videoLoop: true,
        videoOverlayColor: 'rgba(255, 0, 0, 0.45)',
        videoPlayOnlyVisible: true,
        videoSrc: 'https://example.video'
    };
    const parallaxElementMock = {
        jarallax: {
            video: {
                on: () => {}
            }
        }
    };
    createTestInstance(<Banner {...bannerProps} />, {
        createNodeMock: () => {
            return parallaxElementMock;
        }
    });
    expect(mockJarallaxVideo).toHaveBeenCalled();
    expect(mockJarallax).toHaveBeenCalledWith(parallaxElementMock, {
        elementInViewport: parallaxElementMock,
        imgSrc: 'parallax.jpg',
        speed: 1,
        videoLazyLoading: true,
        videoLoop: true,
        videoPlayOnlyVisible: true,
        videoSrc: 'https://example.video'
    });
});

test('banner unmount causes Jarallax to be destroyed', () => {
    const bannerProps = {
        backgroundType: 'video',
        videoFallbackSrc: 'parallax.jpg',
        videoLazyLoading: true,
        videoLoop: true,
        videoOverlayColor: 'rgba(255, 0, 0, 0.45)',
        videoPlayOnlyVisible: true,
        videoSrc: 'https://example.video'
    };
    const parallaxElementMock = {
        jarallax: {
            video: {
                on: () => {}
            }
        }
    };
    const component = createTestInstance(<Banner {...bannerProps} />, {
        createNodeMock: () => {
            return parallaxElementMock;
        }
    });
    act(() => {
        component.unmount();
    });

    expect(mockJarallax.mock.calls[1]).toEqual([
        parallaxElementMock,
        'destroy'
    ]);
});
