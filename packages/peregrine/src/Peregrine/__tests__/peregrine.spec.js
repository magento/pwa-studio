import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Peregrine from '../peregrine';

test('render wraps children with all peregrine context providers', () => {
    const shallowRenderer = new ShallowRenderer();
    const tree = shallowRenderer.render(
        <Peregrine>
            <i />
        </Peregrine>
    );

    expect(tree).toMatchSnapshot();
});

test('render wraps children with single peregrine context provider', () => {
    const shallowRenderer = new ShallowRenderer();
    const tree = shallowRenderer.render(
        <Peregrine providers={['TOASTS']}>
            <i />
        </Peregrine>
    );

    expect(tree).toMatchSnapshot();
});

test('fails to render with invalid context provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(
        <Peregrine providers={['WAFFLES']}>
            <i />
        </Peregrine>
    );

    expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining(
            'Invalid prop `providers[0]` of value `WAFFLES` supplied to `Peregrine`, expected one of ["TOASTS","WINDOW_SIZE"].'
        )
    );
});
