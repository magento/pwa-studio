import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Peregrine from '../peregrine';

test('render wraps children with peregrine context providers', () => {
    const shallowRenderer = new ShallowRenderer();
    const tree = shallowRenderer.render(
        <Peregrine>
            <i />
        </Peregrine>
    );

    expect(tree).toMatchSnapshot();
});
