import React from 'react';
import { storiesOf } from '@storybook/react';

import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';

import Image from '../image';
import classes from './image.module.css';

const stories = storiesOf('Components/Image', module);

const getSrc = text =>
    `https://via.placeholder.com/400x600/0000FF/FFFFFF?text=${encodeURI(text)}`;
const getSrc19 = text =>
    `https://via.placeholder.com/480x270/0000FF/FFFFFF?text=${encodeURI(text)}`;

const loadingPlaceholder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASsAAACoCAMAAACPKThEAAAAsVBMVEUiOUsiJ0IiNUkiz64i2rYiQlEiOEwiP08lP08qSVUiQVEpRlMaKEIjPE0dL0VKiYExWF9Hgnw8bmwsTFciKkM1X2MbK0MxV19FfnlBd3Jdrpk4ZWg7bW5AdHM6ampMjYJRl4lYo5NjuqJowqdty64gI0AisJgioI0ihHoikoMib2wiFzsiYGMipJAivKAieXMiwaQi6L8ijH8iVlwiHz8iEToiADIhTVYiY2VaqZUj4LlYhDuQAAAEIUlEQVR4nO3ZD1PiOAAF8DTYNG1IWmjaglAUpX8AqUW8c9fv/8Euraurrpx7OyOFm/ebN50KzqTzKAkBQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6JvvmLMcI6upDjR3dvyuIP1EFZe+hak1gzQrUiROldTgul1NMDquuLOzK6ttgmd9UqX2prWa02utTlMn9QN3lZoqw3dLWud17Pul0vb4u7+zyP67+2u7BHe9bqzOr66o6Lrlme6eJmU+RlbtGHTVytq8yqV2W8rjSm+td0ve4R3dtt/l6Wm9W6MPfVuta6jnvObc+SDqb6n1ShH/LqRhd5sdJ5VZa0sMzsbh4tVpVYFrslJq0Xyqx4mpolUFGizdrHlHmIxCq/q0qzIlJU9bn4m4eafhf9/F/gf0hp63Ro1eFyqtVd3TsdVam7mv1YVmzzlc3+K7o39LOo96E/wkw+G1as8u0y6+TWYvosjzX9aGwpTZjkjHPmcSZMbOLaJOQs9MxRJk14wu1AeoEUEXEj6UY0nNCkTTBRUZtJm+lEDSOVRnQcsVFATAYJ9xPhh6HvJhcmPLjgxIzqkOb4NHx75M8nUlKqaV13UlZ2tudFksRUxD1iC+YKFgoSuiQJWRCyqAmfhHzm8qkQqeuOvXBshyMnGPBoQCNfzXw69FXqx4OL/sDv+37/wo8v/Xg+6H8fqfMROx/Lq1ReDcPrYXIdBYtotgiGC3e8ENImzo8wz8QjJvbLicdsh93ndXboosxcVVT3Hz/z1JVNRNuV67K3XclJKGeCT10xFW5quvLCEQ9MnruaDkxX/ZH/qqtBfDnqz5+7Ok/51dB96uo6mC2Stiv7VVdtTEW26cq01HblNHHWvcN/ccHi7b5V5V1X4o+6ir+kK2au6vHgN5Yqc73nqaPuysnq1aE/4Opq75BH3JWJutvse5G/itVz9y0ox90VXVWH78o+0a6+HbwrXX870ffg/on2q6jl3rf9cXdlVbeH3+hsrdP7zEBsSbeH/7FD58WeQY+4K+ZkVREftqiGflx9XNZLV/bTHufXrto9jivS113Jn101e5ymqHd7nPngpSv53FW0CD7a4zTxfu3KI9ldJ7+hUc/s2j/+7N7sVjmxOREea+8u0uwKBUsEaSMjwSNhR0JMeJOZDE2mLElpZDJUk1TNUjVNVZqq8VCNhmowVf6MXszIxURemkTiMnLnSTJPgnkYzcXkO5ceMTEbUekwE8ch7bGNbCJVtjnTnXzRQGn9WLI//eIt25usiW6O90/nTe7/JVa2bvIpb7nNu6nK7Amth/zx7IRs3K6qMqjOND0V5lq7/km26/F/EzuR6wQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgx/wDGcra5uVy7UQAAAABJRU5ErkJggg==';

stories.add('An Image using a direct src', () => {
    const text = 'The img src is set directly.';

    return (
        <div className={classes.container}>
            <Image
                alt={text}
                classes={{ root: classes.root }}
                src={getSrc(text)}
            />
        </div>
    );
});

stories.add('An Image with a custom placeholder (throttle me)', () => {
    return (
        <div className={classes.container}>
            <Image
                alt="An Image with a custom placeholder (throttle me)"
                classes={{ root: classes.root }}
                placeholder={loadingPlaceholder}
                src={getSrc('Actual Image')}
            />
        </div>
    );
});

stories.add('An Image using a Magento resource', () => (
    // Magento resource images are usually relative paths (like data back from GraphQL)
    // but none of that infrastructure is set up in storybook so we fake with an absolute path.
    <div className={classes.container}>
        <Image
            alt="An Image using a Magento resource"
            classes={{ root: classes.root }}
            resource={getSrc('Resource')}
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
                resource={getSrc('Constrained')}
                width="80"
            />
        </div>
    )
);

stories.add(
    'An Image using a Magento resource with resource constraints with ratio',
    () => (
        <div className={classes.container}>
            <Image
                alt="An Image using a Magento resource with resource constraints"
                classes={{ root: classes.root }}
                resource={getSrc19('480x270')}
                ratio={16 / 9}
            />
        </div>
    )
);

stories.add(
    'An Image using a Magento resource with resource constraints with ratio and widths',
    () => {
        const widths = new Map()
            .set(320, 240)
            .set(768, 480)
            .set(1024, 960)
            .set(UNCONSTRAINED_SIZE_KEY, 1280);

        return (
            <div className={classes.container}>
                <Image
                    alt="An Image using a Magento resource with resource constraints"
                    classes={{ root: classes.root }}
                    resource={getSrc19('480x270')}
                    ratio={16 / 9}
                    widths={widths}
                />
            </div>
        );
    }
);

stories.add('An Image using a Magento resource with sizes', () => {
    const widths = new Map().set(640, 300).set(UNCONSTRAINED_SIZE_KEY, 800);

    return (
        <div className={classes.container}>
            <Image
                alt="An Image using a Magento resource with sizes"
                classes={{ root: classes.root }}
                resource={getSrc('Increase viewport, view network')}
                widths={widths}
            />
        </div>
    );
});
