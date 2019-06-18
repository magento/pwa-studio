import { useState, useEffect, useCallback } from 'react';

const findDOMElement = queryString => document.querySelector(queryString);

const findDOMElements = queryString => document.querySelectorAll(queryString);

const findElement = (queryString, shouldFindAll) =>
    shouldFindAll ? findDOMElements(queryString) : findDOMElement(queryString);

export const useDOMQuery = (queryString, shouldFindAll = false) => {
    const [element, setElement] = useState();
    useEffect(() => {
        setElement(findElement(queryString, shouldFindAll));
    }, []);
    const setInnerHTMl = useCallback(
        content => {
            if (element) {
                element.innerHTMl = content || element.innerHTMl;
            }
        },
        [element]
    );
    const setInnerText = useCallback(
        content => {
            if (element) {
                element.innerText = content || element.innerText;
            }
        },
        [element]
    );
    const setAttribute = useCallback(
        (attribute, value) => {
            if (element) {
                element[attribute] = value || element[attribute];
            }
        },
        [element]
    );
    return [element, { setInnerHTMl, setInnerText, setAttribute }];
};
