import { useCallback, useEffect } from 'react';

/**
 * A custom event for non react parts of the code to listen to
 * when page change has been triggerd.
 */
const dispatchTitleChangeEvent = () => {
    document.dispatchEvent(new Event('TITLE_CHANGED'), {
        bubbles: true,
        cancelable: false
    });
};

/**
 * A hook that will return current page title and an updater.
 * It also subscribes to page title change and executes
 * onPageTitleChange callback if provided.
 */
const usePageTitle = onPageTitleChange => {
    const { title } = document;
    const updateTitle = useCallback(newTitle => {
        if (newTitle) {
            document.title = newTitle;
            dispatchTitleChangeEvent();
        }
    }, []);
    useEffect(() => {
        onPageTitleChange && onPageTitleChange(title);
    }, [title]);
    return [title, updateTitle];
};

export default usePageTitle;
