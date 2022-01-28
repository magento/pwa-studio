import React, { useEffect } from 'react';
import { useMediaQuery } from '../useMediaQuery';
import { createTestInstance } from '@magento/peregrine';
import { act } from 'react-test-renderer';

const log = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

jest.spyOn(global, 'matchMedia').mockImplementation(query => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    dispatchEvent: jest.fn()
}));

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
        expect(log).toHaveBeenCalledWith(mockOneMedia.mediaQueries[0].style);
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
        const root = createTestInstance(<Component mockProps={mockOneMedia} />);
        expect(mockAddEventListener).toHaveBeenCalled();

        act(() => {
            root.unmount();
        });
        expect(mockRemoveEventListener).toHaveBeenCalled();
    });
});
