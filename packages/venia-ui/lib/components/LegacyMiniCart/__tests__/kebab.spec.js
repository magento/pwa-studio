import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Kebab from '../kebab';

const renderer = new ShallowRenderer();

test('it renders correctly without children', () => {
    const tree = renderer.render(<Kebab />);

    expect(tree).toMatchSnapshot();
});

test('it renders children passed to it', () => {
    const tree = renderer.render(
        <Kebab>
            <span />
            <p />
            <div />
        </Kebab>
    );

    expect(tree).toMatchSnapshot();
});
