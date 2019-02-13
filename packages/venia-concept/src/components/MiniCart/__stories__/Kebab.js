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
        <Kebab isOpen={false} />
    </div>
));

stories.add('Kebab Open', () => (
    <div style={styles}>
        <Kebab isOpen={true}>
            <Section icon="Heart" text="Section 1" />
            <Section icon="Edit2" text="Section 2" />
            <Section icon="Trash" text="Section 3" />
            <Section text="Non-icon Section" />
        </Kebab>
    </div>
));
