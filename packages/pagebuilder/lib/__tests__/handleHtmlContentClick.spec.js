import handleHtmlContentClick from '../handleHtmlContentClick';

const mockHistoryPush = jest.fn();

const mockHistory = {
    push: mockHistoryPush
};

test('does nothing when the target is not a link', () => {
    const preventDefault = jest.fn();

    const event = {
        target: {
            tagName: 'P'
        },
        preventDefault: preventDefault
    };

    handleHtmlContentClick(mockHistory, event);

    expect(preventDefault).not.toHaveBeenCalled();
});

describe('when the target is a link', () => {
    const preventDefault = jest.fn();

    test('uses the push() function in the history object if it is internal', () => {
        const event = {
            code: 'Enter',
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

        handleHtmlContentClick(mockHistory, event);

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
            type: 'click',
            view: {
                location: {
                    origin: 'https://my-magento.store'
                }
            },
            preventDefault: preventDefault
        };

        handleHtmlContentClick(mockHistory, event);

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
            type: 'click',
            view: {
                location: {
                    origin: 'https://my-magento.store'
                }
            },
            preventDefault: preventDefault
        };

        handleHtmlContentClick(mockHistory, event);

        expect(preventDefault).toHaveBeenCalled();
        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(mockOpen).toHaveBeenCalledWith(event.target.href, '_blank');
    });
});
