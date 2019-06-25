import React, { useEffect } from 'react';
import { mount } from 'enzyme';

import { useDOMQuery } from '../useDOMQuery';

const TestValidComponent = ({ newText, newHTML, newName }) => {
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

const TestInvalidComponent = ({ selector, callWithElements }) => {
    const [elements] = useDOMQuery(selector);
    useEffect(() => {
        callWithElements(elements);
    }, [elements]);
    return <div id="abc" />;
};

beforeAll(() => {
    const div = document.createElement('div');
    window.domNode = div;
    document.body.appendChild(div);
});

it('setInnerText, setInnerHTML and setAttribute manipulate DOM when a valid query selector is provided', () => {
    const newText = 'Changed after mount.';
    const newHTML = '<i>Changed after mount.</i>';
    const newName = 'newName';
    const wrapper = mount(
        <TestValidComponent
            newText={newText}
            newHTML={newHTML}
            newName={newName}
        />,
        { attachTo: window.domNode }
    );
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 0);
    }).then(() => {
        const div1 = wrapper.find('#div1').getDOMNode();
        const div2 = wrapper.find('#div2').getDOMNode();
        expect(div1.innerText).toBe(newText);
        expect(div2.innerHTML).toBe(newHTML);
        expect(div2.getAttribute('name')).toBe(newName);
    });
});

it('Elements should be empty if an invalid query selector is provided', () => {
    const callWithElements = jest.fn();
    mount(
        <TestInvalidComponent
            selector="#xyz"
            callWithElements={callWithElements}
        />
    );
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 0);
    }).then(() => {
        const { calls } = callWithElements.mock;
        expect(calls[calls.length - 1][0]).toHaveLength(0);
    });
});
