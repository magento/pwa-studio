import { createTestInstance } from '@magento/peregrine';
import React from 'react';
import Products, { GET_PRODUCTS_BY_URL_KEY } from '../products';

jest.mock(
    '@magento/peregrine/lib/hooks/useCustomerWishlistSkus/useCustomerWishlistSkus',
    () => ({
        useCustomerWishlistSkus: jest.fn()
    })
);

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    return {
        ...apolloClient,
        useQuery: jest.fn()
    };
});
jest.mock('react-slick', () => {
    return jest.fn();
});
import SlickSlider from 'react-slick';
const mockSlick = SlickSlider.mockImplementation(({ children }) => (
    <div>{children}</div>
));
import { useQuery } from '@apollo/client';
jest.mock('@magento/venia-ui/lib/components/Gallery', () => jest.fn());
jest.mock('@magento/venia-ui/lib/components/Gallery/item', () => jest.fn());
import Gallery from '@magento/venia-ui/lib/components/Gallery';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
const mockGallery = Gallery.mockImplementation(() => 'Gallery');
const mockGalleryItem = GalleryItem.mockImplementation(() => 'GalleryItem');

test('render products with no props & no products', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: []
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with all props & no products', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: []
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const productsProps = {
        pathNames: [
            'https://test.com/TEST-1.html',
            'https://test.com/TEST-2.html'
        ],
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

    const component = createTestInstance(<Products {...productsProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with loading state', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: []
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with error state in production mode', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: []
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products with error state in development mode', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: []
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const component = createTestInstance(<Products />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render products and ensure order is correct passed to Gallery', () => {
    const urlKeys = ['TEST-1', 'TEST-2'];
    const pathNames = [
        'https://test.com/TEST-1.html',
        'https://test.com/TEST-2.html'
    ];
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: [
                            {
                                sku: 'TEST-2',
                                url_key: 'TEST-2'
                            },
                            {
                                sku: 'TEST-1',
                                url_key: 'TEST-1'
                            }
                        ]
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const productProps = { pathNames };

    createTestInstance(<Products {...productProps} />);
    expect(useQuery).toHaveBeenCalledWith(GET_PRODUCTS_BY_URL_KEY, {
        variables: { url_keys: urlKeys, pageSize: urlKeys.length },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    expect(mockGallery).toHaveBeenCalledWith(
        expect.objectContaining({
            items: [
                {
                    sku: 'TEST-1',
                    url_key: 'TEST-1'
                },
                {
                    sku: 'TEST-2',
                    url_key: 'TEST-2'
                }
            ]
        }),
        expect.anything()
    );
});

test('render carousel with default props and verify Slick is called correctly', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: [
                            {
                                sku: 'TEST-1',
                                url_key: 'TEST-1',
                                small_image: {
                                    url: '/test/product/1.png'
                                }
                            },
                            {
                                sku: 'TEST-2',
                                url_key: 'TEST-2',
                                small_image: {
                                    url: '/test/product/2.png'
                                }
                            }
                        ]
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const productProps = {
        pathNames: [
            'https://test.com/TEST-1.html',
            'https://test.com/TEST-2.html'
        ],
        appearance: 'carousel',
        autoplay: false,
        autoplaySpeed: 4000,
        infinite: false,
        arrows: false,
        dots: true,
        carouselMode: 'default',
        centerPadding: '60px'
    };
    createTestInstance(<Products {...productProps} />);

    expect(mockGalleryItem).toHaveBeenCalledWith(
        expect.objectContaining({
            item: {
                sku: 'TEST-1',
                url_key: 'TEST-1',
                small_image: {
                    url: '/test/product/1.png'
                }
            }
        }),
        expect.anything()
    );
    expect(mockGalleryItem).toHaveBeenCalledWith(
        expect.objectContaining({
            item: {
                sku: 'TEST-2',
                url_key: 'TEST-2',
                small_image: {
                    url: '/test/product/2.png'
                }
            }
        }),
        expect.anything()
    );
    expect(mockSlick).toHaveBeenCalledWith(
        expect.objectContaining({
            autoplay: false,
            autoplaySpeed: 4000,
            infinite: false,
            draggable: false,
            arrows: false,
            dots: true,
            slidesToShow: 5,
            slidesToScroll: 5,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        centerMode: false,
                        infinite: false
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                }
            ]
        }),
        expect.anything()
    );
});

test('render carousel with continuous mode and verify Slick is called correctly', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: [
                            {
                                sku: 'TEST-1',
                                url_key: 'TEST-1',
                                small_image: '/test/product/1.png'
                            },
                            {
                                sku: 'TEST-2',
                                url_key: 'TEST-2',
                                small_image: '/test/product/2.png'
                            },
                            {
                                sku: 'TEST-3',
                                url_key: 'TEST-3',
                                small_image: '/test/product/3.png'
                            },
                            {
                                sku: 'TEST-4',
                                url_key: 'TEST-4',
                                small_image: '/test/product/4.png'
                            },
                            {
                                sku: 'TEST-5',
                                url_key: 'TEST-5',
                                small_image: '/test/product/5.png'
                            },
                            {
                                sku: 'TEST-6',
                                url_key: 'TEST-6',
                                small_image: '/test/product/6.png'
                            }
                        ]
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const productProps = {
        pathNames: [
            'https://test.com/TEST-1.html',
            'https://test.com/TEST-2.html',
            'https://test.com/TEST-3.html',
            'https://test.com/TEST-4.html',
            'https://test.com/TEST-5.html',
            'https://test.com/TEST-6.html'
        ],
        appearance: 'carousel',
        autoplay: false,
        autoplaySpeed: 4000,
        infinite: true,
        arrows: false,
        dots: true,
        carouselMode: 'continuous',
        centerPadding: '90px'
    };
    createTestInstance(<Products {...productProps} />);

    expect(mockSlick).toHaveBeenCalledWith(
        expect.objectContaining({
            autoplay: false,
            autoplaySpeed: 4000,
            draggable: false,
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 5,
            centerMode: true,
            centerPadding: '90px',
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        centerMode: true,
                        infinite: true,
                        centerPadding: '90px'
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                }
            ]
        }),
        expect.anything()
    );
});

test('render carousel with infinite loop and verify Slick is called correctly', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: [
                            {
                                sku: 'TEST-1',
                                url_key: 'TEST-1',
                                small_image: '/test/product/1.png'
                            },
                            {
                                sku: 'TEST-2',
                                url_key: 'TEST-2',
                                small_image: '/test/product/2.png'
                            },
                            {
                                sku: 'TEST-3',
                                url_key: 'TEST-3',
                                small_image: '/test/product/3.png'
                            },
                            {
                                sku: 'TEST-4',
                                url_key: 'TEST-4',
                                small_image: '/test/product/4.png'
                            },
                            {
                                sku: 'TEST-5',
                                url_key: 'TEST-5',
                                small_image: '/test/product/5.png'
                            },
                            {
                                sku: 'TEST-6',
                                url_key: 'TEST-6',
                                small_image: '/test/product/6.png'
                            }
                        ]
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const productProps = {
        pathNames: [
            'https://test.com/TEST-1.html',
            'https://test.com/TEST-2.html',
            'https://test.com/TEST-3.html',
            'https://test.com/TEST-4.html',
            'https://test.com/TEST-5.html',
            'https://test.com/TEST-6.html'
        ],
        appearance: 'carousel',
        autoplay: false,
        autoplaySpeed: 4000,
        infinite: true,
        arrows: false,
        dots: true,
        carouselMode: 'default'
    };
    createTestInstance(<Products {...productProps} />);

    expect(mockSlick).toHaveBeenCalledWith(
        expect.objectContaining({
            autoplay: false,
            autoplaySpeed: 4000,
            draggable: false,
            infinite: true,
            arrows: false,
            dots: true,
            slidesToShow: 5,
            slidesToScroll: 5,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        centerMode: false,
                        infinite: true
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                }
            ]
        }),
        expect.anything()
    );
});

test('render carousel with continuous mode with 5 products and verify Slick is called correctly', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: [
                            {
                                sku: 'TEST-1',
                                url_key: 'TEST-1',
                                small_image: '/test/product/1.png'
                            },
                            {
                                sku: 'TEST-2',
                                url_key: 'TEST-2',
                                small_image: '/test/product/2.png'
                            },
                            {
                                sku: 'TEST-3',
                                url_key: 'TEST-3',
                                small_image: '/test/product/3.png'
                            },
                            {
                                sku: 'TEST-4',
                                url_key: 'TEST-4',
                                small_image: '/test/product/4.png'
                            },
                            {
                                sku: 'TEST-5',
                                url_key: 'TEST-5',
                                small_image: '/test/product/5.png'
                            }
                        ]
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const productProps = {
        pathNames: [
            'https://test.com/TEST-1.html',
            'https://test.com/TEST-2.html',
            'https://test.com/TEST-3.html',
            'https://test.com/TEST-4.html',
            'https://test.com/TEST-5.html'
        ],
        appearance: 'carousel',
        autoplay: false,
        autoplaySpeed: 4000,
        infinite: true,
        arrows: true,
        dots: true,
        carouselMode: 'continuous',
        centerPadding: '90px'
    };
    createTestInstance(<Products {...productProps} />);

    expect(mockSlick).toHaveBeenCalledWith(
        expect.objectContaining({
            autoplay: false,
            autoplaySpeed: 4000,
            draggable: false,
            infinite: false,
            arrows: true,
            dots: true,
            slidesToShow: 5,
            slidesToScroll: 5,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        centerMode: true,
                        centerPadding: '90px',
                        infinite: true
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToScroll: 3,
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                }
            ]
        }),
        expect.anything()
    );
});

test('render carousel with continuous mode with 1 product and verify Slick is called correctly', () => {
    useQuery.mockImplementation(arg => {
        if (arg.definitions['0'].name.value === 'getProductsByUrlKey') {
            return {
                data: {
                    products: {
                        items: [
                            {
                                sku: 'TEST-1',
                                url_key: 'TEST-1',
                                small_image: '/test/product/1.png'
                            }
                        ]
                    }
                },
                error: false,
                loading: false
            };
        }
        return {
            data: {
                storeConfig: {
                    product_url_suffix: '.html'
                }
            }
        };
    });

    const productProps = {
        pathNames: ['https://test.com/TEST-1.html'],
        appearance: 'carousel',
        autoplay: true,
        autoplaySpeed: 4000,
        infinite: true,
        arrows: false,
        dots: true,
        carouselMode: 'continuous',
        centerPadding: '90px'
    };
    createTestInstance(<Products {...productProps} />);

    expect(mockSlick).toHaveBeenCalledWith(
        expect.objectContaining({
            autoplay: true,
            autoplaySpeed: 4000,
            infinite: false,
            arrows: false,
            dots: true,
            slidesToShow: 5,
            slidesToScroll: 5,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        centerMode: false,
                        infinite: false
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                }
            ]
        }),
        expect.anything()
    );
});
