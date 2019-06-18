import { useCallback, useEffect } from 'react';

const TITLE_CHANGED = 'TITLE_CHANGED';

/**
 * A custom event for non react parts of the code to listen to
 * when page change has been triggerd.
 */
const dispatchTitleChangeEvent = () => {
    document.dispatchEvent(new Event(TITLE_CHANGED), {
        bubbles: true,
        cancelable: false
    });
};

const subscribeToTitleChangeEvent = onPageTitleChange => {
    document.addEventListener(TITLE_CHANGED, onPageTitleChange);
};

const unSubscribeToTitleChangeEvent = onPageTitleChange => {
    document.removeEventListener(TITLE_CHANGED, onPageTitleChange);
};

/**
 * Hook that can be used to subscribe to title changes.
 * @param {(string) => void} _onPageTitleChange
 */
export const usePageTitleSubscription = _onPageTitleChange => {
    const onPageTitleChange = useCallback(() => {
        _onPageTitleChange(document.title);
    }, [_onPageTitleChange]);
    useEffect(() => {
        subscribeToTitleChangeEvent(onPageTitleChange);
        return () => unSubscribeToTitleChangeEvent(onPageTitleChange);
    }, [onPageTitleChange]);
};

/**
 * A hook that will return current page title and an updater.
 */
export const usePageTitle = () => {
    const { title } = document;
    const updateTitle = useCallback(newTitle => {
        if (newTitle) {
            document.title = newTitle;
            dispatchTitleChangeEvent();
        }
    }, []);
    return [title, updateTitle];
};
