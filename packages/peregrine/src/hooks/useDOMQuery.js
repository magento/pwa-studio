import { useState, useEffect, useCallback } from 'react';

const findDOMElements = queryString =>
    document.querySelectorAll(queryString) || [];

export const useDOMQuery = queryString => {
    const [elements, setElements] = useState([]);
    useEffect(() => {
        setElements(findDOMElements(queryString));
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
