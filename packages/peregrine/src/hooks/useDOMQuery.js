import { useState, useEffect, useCallback } from 'react';

const findDOMElements = querySelector =>
    document.querySelectorAll(querySelector) || [];

const isValidString = str =>
    str !== undefined && str != null && typeof str === 'string';

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
            if (isValidString(content)) {
                elements.forEach(element => {
                    element.innerHTML = content;
                });
            }
        },
        [elements]
    );
    const setInnerText = useCallback(
        content => {
            if (isValidString(content)) {
                elements.forEach(element => {
                    element.innerText = content;
                });
            }
        },
        [elements]
    );
    const setAttribute = useCallback(
        (attribute, value) => {
            if (isValidString(attribute)) {
                elements.forEach(element => {
                    element.setAttribute(attribute, value);
                });
            }
        },
        [elements]
    );
    return [elements, { setInnerHTML, setInnerText, setAttribute }];
};
