import React, { useEffect } from 'react';
import { mount } from 'enzyme';

import { useDOMQuery } from '../useDOMQuery';

let container;

const oldText = 'I am a Test Div';

const TestValidComponent = ({ newText, newHTML, newName }) => {
    const [, { setInnerText, setInnerHTML, setAttribute }] = useDOMQuery(
        '#testDiv'
    );
    useEffect(() => {
        setInnerText(newText);
        setInnerHTML(newHTML);
        setAttribute('name', newName);
    }, [setInnerText, setInnerHTML, setAttribute]);
    return (
        <div id="testDiv" name="oldName">
            {oldText}
        </div>
    );
};

const TestInvalidComponent = ({ selector, callWithElements }) => {
    const [elements] = useDOMQuery(selector);
    useEffect(() => {
        callWithElements(elements);
    }, [elements]);
    return <div id="abc" />;
};

const dummyPromise = fn =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 0);
    }).then(fn);

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

it('setInnerText should change inner text of the given valid selector', () => {
    const newText = 'Changed after mount.';
    const wrapper = mount(<TestValidComponent newText={newText} />, {
        attachTo: container
    });
    return dummyPromise(() => {
        expect(wrapper.find('#testDiv').getDOMNode().innerText).toBe(newText);
    });
});

it('setInnerHTML should change HTML of the given valid selector', () => {
    const newHTML = '<i>Changed after mount.</i>';
    const wrapper = mount(<TestValidComponent newHTML={newHTML} />, {
        attachTo: container
    });
    return dummyPromise(() => {
        expect(wrapper.find('#testDiv').getDOMNode().innerHTML).toBe(newHTML);
    });
});

it('setAttribute should change the attribute value of the given valid selector', () => {
    const newName = 'newName';
    const wrapper = mount(<TestValidComponent newName={newName} />, {
        attachTo: container
    });
    return dummyPromise(() => {
        expect(
            wrapper
                .find('#testDiv')
                .getDOMNode()
                .getAttribute('name')
        ).toBe(newName);
    });
});

it('setInnerText should clear inner text of the given valid selector if an empty string is provided', () => {
    const newText = '';
    const wrapper = mount(<TestValidComponent newText={newText} />, {
        attachTo: container
    });
    return dummyPromise(() => {
        expect(wrapper.find('#testDiv').getDOMNode().innerText).toBe(newText);
    });
});

it('setInnerHTML should clear inner HTML of the given valid selector if an empty string is provided', () => {
    const newHTML = '';
    const wrapper = mount(<TestValidComponent newHTML={newHTML} />, {
        attachTo: container
    });
    return dummyPromise(() => {
        expect(wrapper.find('#testDiv').getDOMNode().innerHTML).toBe(newHTML);
    });
});

it('setInnerText should not change inner text of the given valid selector if an invalid input is provided', () => {
    const newText = 1234;
    const wrapper = mount(<TestValidComponent newText={newText} />, {
        attachTo: container
    });
    return dummyPromise(() => {
        /**
         * using wrapper.find('#testDiv').text() instead of
         * wrapper.find('#testDiv').getDOMNode().innerText
         * because JSDOM is not creating innerText by default.
         * This is JSDOM's default behavior since innerText is
         * astetic stuff and JSDOM does not have a UI implementation.
         * 
         * https://github.com/jsdom/jsdom/issues/1245#issuecomment-243231866
         */
        expect(wrapper.find('#testDiv').text()).toBe(oldText);
    });
});

it('setInnerHTML should not change inner HTML of the given valid selector if an invalid input is provided', () => {
    const newHTML = null;
    const wrapper = mount(<TestValidComponent newHTML={newHTML} />, {
        attachTo: container
    });
    return dummyPromise(() => {
        expect(wrapper.find('#testDiv').getDOMNode().innerHTML).toBe(oldText);
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
