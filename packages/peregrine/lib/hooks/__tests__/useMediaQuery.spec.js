import React, { useEffect } from 'react';
import { useMediaQuery } from '../useMediaQuery';
import { createTestInstance } from '@magento/peregrine';
import { act } from 'react-test-renderer';

const log = jest.fn();

const matchMediaSpy = jest.spyOn(global, 'matchMedia');

const mockOneMedia = {
    mediaQueries: [
        {
            media: 'only screen and (min-width: 768px)',
            style: {
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column'
            }
        }
    ]
};

const mockTwoMedias = {
    mediaQueries: [
        {
            media: 'only screen and (min-width: 768px)',
            style: {
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        {
            media: 'only screen and (min-width: 1024px)',
            style: {
                minHeight: '400px',
                flexDirection: 'row',
                color: 'blue'
            }
        }
    ]
};

const Component = ({ mockProps }) => {
    const { styles } = useMediaQuery(mockProps);

    useEffect(() => {
        log(styles);
    }, [styles]);

    return <i />;
};

describe('UseMediaQuery', () => {
    it('should return empty styles if no media query is provided', () => {
        createTestInstance(<Component />);
        expect(log).toHaveBeenLastCalledWith({});
    });

    it('should return matched styles from one media query', () => {
        createTestInstance(<Component mockProps={mockOneMedia} />);
        expect(log).toHaveBeenLastCalledWith({
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
        });
    });

    it('should return matched styles from multiple media queries', () => {
        createTestInstance(<Component mockProps={mockTwoMedias} />);
        expect(log).toHaveBeenLastCalledWith({
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'row',
            color: 'blue'
        });
    });

    it('should add/remove matchMedia event listeners', () => {
        const mockAddEventListener = jest.fn();
        const mockRemoveEventListener = jest.fn();
        matchMediaSpy.mockImplementation(query => ({
            matches: true,
            media: query,
            onchange: null,
            addEventListener: mockAddEventListener,
            removeEventListener: mockRemoveEventListener,
            dispatchEvent: jest.fn()
        }));

        const root = createTestInstance(<Component mockProps={mockOneMedia} />);
        expect(mockAddEventListener).toHaveBeenCalled();

        act(() => {
            root.unmount();
        });
        expect(mockRemoveEventListener).toHaveBeenCalled();
    });

    it('should return empty styles if no media query matches at initial render', () => {
        matchMediaSpy.mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        }));

        createTestInstance(<Component mockProps={mockOneMedia} />);

        expect(log).toHaveBeenLastCalledWith({});
    });

    it('should add query styles if they match after change event', () => {
        const mockAddEventListener = jest.fn();
        matchMediaSpy.mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: mockAddEventListener,
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        }));

        createTestInstance(<Component mockProps={mockOneMedia} />);

        act(() => {
            const handleMatchQuery = mockAddEventListener.mock.calls[0][1];
            handleMatchQuery({ matches: true });
        });

        expect(log).toHaveBeenLastCalledWith({
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
        });
    });

    it('should remove query styles if they no longer match after change event', () => {
        const mockAddEventListener = jest.fn();
        matchMediaSpy.mockImplementation(query => ({
            matches: true,
            media: query,
            onchange: null,
            addEventListener: mockAddEventListener,
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        }));

        createTestInstance(<Component mockProps={mockTwoMedias} />);

        expect(log).toHaveBeenLastCalledWith({
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'row',
            color: 'blue'
        });

        act(() => {
            const handleMatchQueryOne = mockAddEventListener.mock.calls[0][1];
            const handleMatchQueryTwo = mockAddEventListener.mock.calls[1][1];
            handleMatchQueryOne({ matches: true });
            handleMatchQueryTwo({ matches: false });
        });

        expect(log).toHaveBeenLastCalledWith({
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column'
        });
    });
});
