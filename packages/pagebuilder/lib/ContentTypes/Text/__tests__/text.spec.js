import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Text from '../text';

jest.mock('@magento/venia-ui/lib/classify');

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(() => {
            return {
                push: mockHistoryPush
            };
        })
    };
});

test('renders a Text component', () => {
    const textProps = {
        content: '<p>Test text component.</p>'
    };
    const component = createTestInstance(<Text {...textProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Text component with all props configured', () => {
    const textProps = {
        content: '<p>Another text component.</p>',
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
    const component = createTestInstance(<Text {...textProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

describe('clicking on the element', () => {
    const textProps = {
        content: '<p>Test text component.</p>'
    };
    const component = createTestInstance(<Text {...textProps} />);

    const container = component.root.findByType('div');

    test('does nothing if the target is not a link', () => {
        const preventDefault = jest.fn();

        const event = {
            target: {
                tagName: 'P'
            },
            preventDefault: preventDefault
        };

        container.props.onClick(event);

        expect(preventDefault).not.toHaveBeenCalled();
    });

    describe('when the target is a link', () => {
        const preventDefault = jest.fn();

        test('uses the React router if it is internal', () => {
            const event = {
                target: {
                    origin: 'https://my-magento.store',
                    tagName: 'A',
                    pathname: '/checkout.html',
                    href: 'https://my-magento.store/checkout.html'
                },
                view: {
                    location: {
                        origin: 'https://my-magento.store'
                    }
                },
                preventDefault: preventDefault
            };

            container.props.onClick(event);

            expect(preventDefault).toHaveBeenCalled();
            expect(mockHistoryPush).toHaveBeenCalledWith(event.target.pathname);
        });

        test('loads the new URL if it is external', () => {
            const mockAssign = jest.fn();

            delete globalThis.location;

            globalThis.location = {
                assign: mockAssign
            };

            const event = {
                target: {
                    origin: 'https://my-other-magento.store',
                    tagName: 'A',
                    pathname: '/shoes.html',
                    href: 'https://my-other-magento.store/shoes.html'
                },
                view: {
                    location: {
                        origin: 'https://my-magento.store'
                    }
                },
                preventDefault: preventDefault
            };

            container.props.onClick(event);

            expect(preventDefault).toHaveBeenCalled();
            expect(mockHistoryPush).not.toHaveBeenCalled();
            expect(mockAssign).toHaveBeenCalledWith(event.target.href);
        });

        test('opens a new browser tab if there is a tab target specified', () => {
            const mockOpen = jest.fn();

            globalThis.open = mockOpen;

            const event = {
                target: {
                    origin: 'https://my-other-magento.store',
                    tagName: 'A',
                    pathname: '/shoes.html',
                    target: '_blank',
                    href: 'https://my-other-magento.store/shoes.html'
                },
                view: {
                    location: {
                        origin: 'https://my-magento.store'
                    }
                },
                preventDefault: preventDefault
            };

            container.props.onClick(event);

            expect(preventDefault).toHaveBeenCalled();
            expect(mockHistoryPush).not.toHaveBeenCalled();
            expect(mockOpen).toHaveBeenCalledWith(event.target.href, '_blank');
        });
    });
});
