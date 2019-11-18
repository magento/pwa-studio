import React from 'react';
import { storiesOf } from '@storybook/react';

import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';

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

stories.add('An Image without a placeholder (throttle me)', () => (
    <div className={classes.container}>
        <Image
            alt="An Image without a placeholder (throttle me)"
            classes={{ root: classes.root }}
            displayPlaceholder={false}
        />
    </div>
));

stories.add('An Image using a Magento resource', () => (
    <div className={classes.container}>
        <Image
            alt="An Image using a Magento resource"
            classes={{ root: classes.root }}
            resource="timeless.jpg"
        />
    </div>
));

stories.add(
    'An Image using a Magento resource with resource constraints',
    () => (
        <div className={classes.container}>
            <Image
                alt="An Image using a Magento resource with resource constraints"
                classes={{ root: classes.root }}
                height="100"
                resource="timeless.jpg"
                width="80"
            />
        </div>
    )
);

stories.add(
    'An Image using a Magento resource with sizes (resize the viewport above and below 640px + view network)',
    () => {
        const widths = new Map().set(640, 300).set(UNCONSTRAINED_SIZE_KEY, 800);

        return (
            <div className={classes.container}>
                <Image
                    alt="An Image using a Magento resource with sizes"
                    classes={{ root: classes.root }}
                    resource="timeless.jpg"
                    widths={widths}
                />
            </div>
        );
    }
);
