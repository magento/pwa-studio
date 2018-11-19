import React from 'react';
import { storiesOf } from '@storybook/react';

import Kebab from '../kebab';
import Section from '../section';
import 'src/index.css';

const stories = storiesOf('Mini Cart/Kebab', module);

const styles = {
    width: '150px',
    height: '150px',
    display: 'grid'
};

stories.add('Kebab Closed', () => (
    <div style={styles}>
        <Kebab />
    </div>
));

stories.add('Kebab Open', () => (
    <div style={styles}>
        <Kebab isOpen={true}>
            <Section icon="heart" text="Section 1" />
            <Section icon="x" text="Section 2" />
            <Section icon="chevron-up" text="Section 3" />
            <Section text="Non-icon Section" />
        </Kebab>
    </div>
));
