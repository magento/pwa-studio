import React, { useEffect } from 'react';

import { useDOMQuery } from '../useDOMQuery';

export const TestValidComponent = ({ newText, newHTML, newName }) => {
    const [, { setInnerText }] = useDOMQuery('#div1');
    const [, { setInnerHTML, setAttribute }] = useDOMQuery('#div2');
    useEffect(() => {
        setInnerText(newText);
        setInnerHTML(newHTML);
        setAttribute('name', newName);
    }, [setInnerText, setInnerHTML, setAttribute]);
    return (
        <React.Fragment>
            <div id="div1">{'I am Test Div 1'}</div>
            <div id="div2" name="oldName">
                {'I am Test Div 2'}
            </div>
        </React.Fragment>
    );
};

export const TestInvalidComponent = ({
    selector,
    callWithElements
}) => {
    const [elements] = useDOMQuery(selector);
    useEffect(() => {
        callWithElements(elements);
    }, [elements]);
    return <div id="abc" />;
};
