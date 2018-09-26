import React from 'react';
import { storiesOf } from '@storybook/react';
import ContainerChild from '..';
import docs from '../__docs__/ContainerChild.md';
import { withReadme } from 'storybook-readme';

const stories = storiesOf('ContainerChild', module);

stories.add(
    'default',
    withReadme(docs, () => (
        <ContainerChild
            id="example.container.child.id"
            render={() => (
                <div>
                    An example ContainerChild component, rendering its children
                    from the "render" prop
                </div>
            )}
        />
    ))
);
