import React, { useEffect } from 'react';
import { mount } from 'enzyme';

import { usePageTitle } from '../usePageTitle';

const TestComponent = ({ newTitle }) => {
    const [, updateTitle] = usePageTitle();
    useEffect(() => {
        updateTitle(newTitle);
    }, [updateTitle]);
    return <React.Fragment />;
};

beforeAll(() => {
    const div = document.createElement('div');
    window.domNode = div;
    document.body.appendChild(div);
    document.title = 'Old';
});

/**
 * TODO: Skipping because JSDOM/Enzyme is not
 * allowing us to access title.
 */
it.skip('Should change title from Old to New', () => {
    const newTitle = 'New';
    const wrapper = mount(<TestComponent newTitle={newTitle} />, {
        attachTo: window.domNode
    });
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 0);
    }).then(() => {
        expect(wrapper.find('title').getDOMNode().innerText).toBe(newTitle);
    });
});
