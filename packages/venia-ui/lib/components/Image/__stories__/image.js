import React from 'react';
import { storiesOf } from '@storybook/react';

import '../../../index.css';
import Image from '../image';
import classes from './image.css';

const stories = storiesOf('Image', module);

stories.add('An Image using a direct src', () => (
    <div className={classes.container}>
        <Image
            alt="An Image using a direct src"
            classes={{ root: classes.root }}
            src={'https://www.fillmurray.com/400/600'}
        />
    </div>
));

stories.add('An Image with a custom placeholder (throttle me)', () => (
    <div className={classes.container}>
        <Image
            alt="An Image with a custom placeholder (throttle me)"
            classes={{ root: classes.root }}
            placeholder={'https://via.placeholder.com/400x600'}
            src={'https://www.fillmurray.com/400/600'}
        />
    </div>
));

stories.add(
    'An Image using a Magento resource (resize the viewport + view network)',
    () => (
        <div className={classes.container}>
            <Image
                alt="An Image with a custom placeholder (throttle me)"
                classes={{ root: classes.root }}
                resource="timeless.jpg"
            />
        </div>
    )
);

stories.add(
    'An Image using a Magento resource with resource constraints',
    () => (
        <div className={classes.container}>
            <Image
                alt="An Image with a custom placeholder (throttle me)"
                classes={{ root: classes.root }}
                resource="timeless.jpg"
                resourceHeight="100"
                resourceWidth="80"
            />
        </div>
    )
);
