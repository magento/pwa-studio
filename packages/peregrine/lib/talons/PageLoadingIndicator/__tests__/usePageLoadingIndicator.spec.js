import React from 'react';
import { act, create } from 'react-test-renderer';
import { useAppContext } from '../../../context/app';
import usePageLoadingIndicator from '../usePageLoadingIndicator';

jest.mock('../../../context/app', () => {
    return {
        useAppContext: jest.fn()
    };
});

const givenPageLoadingValue = () => {
    useAppContext.mockImplementation(() => [
        {
            isPageLoading: true
        }
    ]);
};

const givenPageNotLoadingValue = () => {
    useAppContext.mockImplementation(() => [
        {
            isPageLoading: false
        }
    ]);
};

const log = jest.fn();
let tree;

const Component = () => {
    log(usePageLoadingIndicator());

    return null;
};

const whenMountingComponent = () => {
    return act(() => {
        tree = create(<Component key="a" />);
    });
};

const whenUpdatingComponent = () => {
    return act(() => {
        tree.update(<Component key="a" />);
    });
};

beforeEach(() => {
    useAppContext.mockClear();
    tree = null;
});

describe('#usePageLoadingIndicator', () => {
    test('returns isPageLoading value from app context', async () => {
        givenPageLoadingValue();

        await whenMountingComponent();

        expect(log).toHaveBeenCalledWith(
            expect.objectContaining({
                isPageLoading: true
            })
        );
    });

    test('cycles through loading state when page loading changes', async () => {
        givenPageLoadingValue();

        await whenMountingComponent();

        givenPageNotLoadingValue();
        await whenUpdatingComponent();

        // Wait for timeout to change status
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
        await whenUpdatingComponent();

        expect(log).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                loadingState: 'off'
            })
        );

        expect(log).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                loadingState: 'loading'
            })
        );

        // Skip one call for state being set

        expect(log).toHaveBeenNthCalledWith(
            4,
            expect.objectContaining({
                loadingState: 'done'
            })
        );

        expect(log).toHaveBeenNthCalledWith(
            5,
            expect.objectContaining({
                loadingState: 'off'
            })
        );
    });
});
