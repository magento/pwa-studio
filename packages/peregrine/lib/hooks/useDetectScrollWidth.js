import { useLayoutEffect, useRef } from 'react';

// Check if browser will add scrollbar to the viewport
const getScrollBarWidth = () => {
    const innerElement = document.createElement('div');
    innerElement.style.cssText = 'width:100%;height:200px';

    const outerElement = document.createElement('div');
    outerElement.style.cssText =
        'position:absolute;top:-50px;left:0px;visibility:hidden;width:50px;height:50px;overflow:hidden';
    outerElement.appendChild(innerElement);
    document.body.appendChild(outerElement);
    const widthWithoutScroll = innerElement.offsetWidth;
    outerElement.style.overflow = 'scroll';
    let widthWithScroll = innerElement.offsetWidth;
    if (widthWithoutScroll === widthWithScroll)
        widthWithScroll = innerElement.clientWidth;

    document.body.removeChild(outerElement);

    return widthWithoutScroll - widthWithScroll;
};

const createObserver = () => {
    return new globalThis.ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target.scrollHeight > globalThis.innerHeight) {
                entry.target.style.setProperty(
                    '--global-scrollbar-width',
                    `${scrollBarWidth}px`
                );
            } else {
                entry.target.style.setProperty(
                    '--global-scrollbar-width',
                    '0px'
                );
            }
        }
    });
};

const scrollBarWidth = getScrollBarWidth();
const observer =
    typeof globalThis.ResizeObserver !== 'undefined' && scrollBarWidth !== 0
        ? createObserver()
        : null;
const canObserve =
    typeof globalThis.ResizeObserver !== 'undefined' && scrollBarWidth !== 0;

export const useDetectScrollWidth = () => {
    const element = useRef(document.body);
    const current = element && element.current;
    const documentBody = element.current;

    useLayoutEffect(() => {
        if (!canObserve) {
            return;
        }
        if (observer && current) {
            observer.unobserve(current);
        }
        observe();
        return () => {
            if (observer && element && documentBody) {
                observer.unobserve(documentBody);
                documentBody.style.setProperty(
                    '--global-scrollbar-width',
                    null
                );
            }
        };
    });

    const observe = () => {
        if (element && documentBody && observer) {
            observer.observe(documentBody);
        }
    };
};
