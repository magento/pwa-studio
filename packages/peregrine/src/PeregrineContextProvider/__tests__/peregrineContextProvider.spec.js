import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import PeregrineContextProvider from '../peregrineContextProvider';

test('render wraps children with all peregrine context providers', () => {
    const shallowRenderer = new ShallowRenderer();
    const tree = shallowRenderer.render(
        <PeregrineContextProvider>
            <i />
        </PeregrineContextProvider>
    );

    expect(tree).toMatchSnapshot();
});
