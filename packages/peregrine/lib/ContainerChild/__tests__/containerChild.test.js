import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ContainerChild from '..';

const renderer = new ShallowRenderer();
const MockChild = () => 'mock-Child';

test('Renders content from render prop', () => {
    renderer.render(
        <ContainerChild
            id="foo.bar"
            render={() => <MockChild />}
            processed={true}
        />
    );
    const wrapper = renderer.getRenderOutput();
    expect(wrapper.type === MockChild).toBe(true);
});
