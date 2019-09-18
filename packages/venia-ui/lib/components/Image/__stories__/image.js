import React from 'react';
import { storiesOf } from '@storybook/react';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';

import Image from '../image';
import '../../../index.css';

import classes from './image.css';
const stories = storiesOf('Image', module);

stories.add('An Image with a placeholder (throttle me)', () => (
    <div className={classes.container}>
        <Image
            alt={'An image with a placeholder'}
            classes={{ root: classes.root }}
            placeholder={transparentPlaceholder}
            src={'https://www.fillmurray.com/400/600'}
        />
    </div>
));

stories.add('An Image without a placeholder', () => (
    <div className={classes.container}>
        <Image
            alt={'An image without a placeholder'}
            src={'https://www.fillmurray.com/400/600'}
        />
    </div>
));
