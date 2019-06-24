import React from 'react';
import { mount } from 'enzyme';

import {
    TestValidComponent,
    TestInvalidComponent
} from '../__mocks__/useDOMQuery';

describe('Unit testing useDOMQuery hook.', () => {
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
});
