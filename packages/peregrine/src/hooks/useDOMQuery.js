import { useState, useEffect, useCallback } from 'react';

const findDOMElements = querySelector =>
    document.querySelectorAll(querySelector) || [];

/**
 * A custom hook that will return the array of elements that
 * match the querySelector. document.querySelectorAll is used
 * to find all elements.
 *
 * @param {string} querySelector
 * @return Array<HTMLElement> and {
 *  setInnerHTML: (string) => void,
 *  setInnerText: (string) => void,
 *  setAttribute: (string, any) => void
 * }
 */
export const useDOMQuery = querySelector => {
    const [elements, setElements] = useState([]);
    useEffect(() => {
        setElements(findDOMElements(querySelector));
    }, []);
    const setInnerHTML = useCallback(
        content => {
            elements.forEach(element => {
                element.innerHTML = content || element.innerHTML;
            });
        },
        [elements]
    );
    const setInnerText = useCallback(
        content => {
            elements.forEach(element => {
                element.innerText = content || element.innerText;
            });
        },
        [elements]
    );
    const setAttribute = useCallback(
        (attribute, value) => {
            elements.forEach(element => {
                element.setAttribute(attribute, value);
            });
        },
        [elements]
    );
    return [elements, { setInnerHTML, setInnerText, setAttribute }];
};
