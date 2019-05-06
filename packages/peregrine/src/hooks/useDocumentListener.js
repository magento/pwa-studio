import { useEffect } from 'react';

export const useDocumentListener = (type, listener, ...rest) => {
    useEffect(() => {
        document.addEventListener(type, listener, ...rest);

        // return a callback, which is called on unmount
        return () => {
            document.removeEventListener(type, listener, ...rest);
        };
    }, [listener, type]);
};
