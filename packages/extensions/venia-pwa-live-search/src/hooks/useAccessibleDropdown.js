import { useEffect, useRef, useState, useCallback } from 'react';

const registerOpenDropdownHandlers = ({
    options,
    activeIndex,
    setActiveIndex,
    select
}) => {
    const optionsLength = options.length;

    const keyDownCallback = e => {
        e.preventDefault();

        switch (e.key) {
            case 'Up':
            case 'ArrowUp':
                setActiveIndex(
                    activeIndex <= 0 ? optionsLength - 1 : activeIndex - 1
                );
                return;
            case 'Down':
            case 'ArrowDown':
                setActiveIndex(
                    activeIndex + 1 === optionsLength ? 0 : activeIndex + 1
                );
                return;
            case 'Enter':
            case ' ': // Space
                select(options[activeIndex].value);
                return;
            case 'Esc':
            case 'Escape':
                select(null);
                return;
            case 'PageUp':
            case 'Home':
                setActiveIndex(0);
                return;
            case 'PageDown':
            case 'End':
                setActiveIndex(options.length - 1);
                return;
        }
    };

    document.addEventListener('keydown', keyDownCallback);
    return () => {
        document.removeEventListener('keydown', keyDownCallback);
    };
};

const registerClosedDropdownHandlers = ({ setIsDropdownOpen }) => {
    const keyDownCallback = e => {
        switch (e.key) {
            case 'Up':
            case 'ArrowUp':
            case 'Down':
            case 'ArrowDown':
            case ' ': // Space
            case 'Enter':
                e.preventDefault();
                setIsDropdownOpen(true);
        }
    };

    document.addEventListener('keydown', keyDownCallback);
    return () => {
        document.removeEventListener('keydown', keyDownCallback);
    };
};

const isSafari = () => {
    const chromeInAgent = navigator.userAgent.indexOf('Chrome') > -1;
    const safariInAgent = navigator.userAgent.indexOf('Safari') > -1;
    return safariInAgent && !chromeInAgent;
};

export const useAccessibleDropdown = ({ options, value, onChange }) => {
    const [isDropdownOpen, setIsDropdownOpenInternal] = useState(false);
    const listRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFocus, setIsFocus] = useState(false);

    const setIsDropdownOpen = useCallback(
        v => {
            if (v) {
                const selected = options?.findIndex(o => o.value === value);
                setActiveIndex(selected < 0 ? 0 : selected);

                if (listRef.current && isSafari()) {
                    requestAnimationFrame(() => {
                        listRef.current?.focus();
                    });
                }
            } else if (listRef.current && isSafari()) {
                requestAnimationFrame(() => {
                    listRef.current?.previousSibling?.focus();
                });
            }

            setIsDropdownOpenInternal(v);
        },
        [options, value]
    );

    const select = useCallback(
        val => {
            if (val !== null && val !== undefined) {
                onChange && onChange(val);
            }
            setIsDropdownOpen(false);
            setIsFocus(false);
        },
        [onChange, setIsDropdownOpen]
    );

    useEffect(() => {
        if (isDropdownOpen) {
            return registerOpenDropdownHandlers({
                activeIndex,
                setActiveIndex,
                options,
                select
            });
        }

        if (isFocus) {
            return registerClosedDropdownHandlers({ setIsDropdownOpen });
        }
    }, [
        isDropdownOpen,
        activeIndex,
        isFocus,
        options,
        select,
        setIsDropdownOpen
    ]);

    return {
        isDropdownOpen,
        setIsDropdownOpen,
        activeIndex,
        setActiveIndex,
        select,
        setIsFocus,
        listRef
    };
};
