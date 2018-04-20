import { createElement } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('Hello World', module).add('with my', () => (
    <button onClick={action('click')}>Hello Button</button>
));
