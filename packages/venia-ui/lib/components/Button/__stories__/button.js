import React from 'react';

import Button from '../button';

import { storiesOf } from '@storybook/react';

const stories = storiesOf('Components/Button', module);

stories.add('Primary', () => {
    return (
        <>
            <h2>Enabled</h2>
            <Button design="primary" size="large" ariaLabel='primary large'>
                Primary L
            </Button>
            <Button design="primary" size="medium" ariaLabel='primary medium'>
                Primary
            </Button>
            <Button design="primary" size="small" ariaLabel='primary small'>
                Primary S
            </Button>
            <h2>Disabled</h2>
            <Button design="primary" size="large" disabled={true} ariaLabel='primary large disabled'>
                Primary L
            </Button>
            <Button design="primary" size="medium" disabled={true} ariaLabel='primary medium disabled'>
                Primary
            </Button>
            <Button design="primary" size="small" disabled={true} ariaLabel='primary small disabled'>
                Primary S
            </Button>
        </>
    );
});

stories.add('Secondary', () => {
    return (
        <>
            <h2>Enabled</h2>
            <Button design="secondary" size="large" ariaLabel='secondary large'>
                Secondary L
            </Button>
            <Button design="secondary" size="medium" ariaLabel='secondary medium'>
                Secondary
            </Button>
            <Button design="secondary" size="small" ariaLabel='secondary small'>
                Secondary S
            </Button>
            <h2>Disabled</h2>
            <Button design="secondary" size="large" disabled={true} ariaLabel='secondary large disabled'>
                Secondary L
            </Button>
            <Button design="secondary" size="medium" disabled={true} ariaLabel='secondary medium disabled'>
                Secondary
            </Button>
            <Button design="secondary" size="small" disabled={true} ariaLabel='secondary small disabled'>
                Secondary S
            </Button>
        </>
    );
});

stories.add('Tertiary', () => {
    return (
        <>
            <h2>Enabled</h2>
            <Button design="tertiary" size="large" ariaLabel='tertiary large'>
                Tertiary L
            </Button>
            <Button design="tertiary" size="medium" ariaLabel='tertiary medium'>
                Tertiary
            </Button>
            <Button design="tertiary" size="small" ariaLabel='tertiary small'>
                Tertiary S
            </Button>
            <h2>Disabled</h2>
            <Button design="tertiary" size="large" disabled={true} ariaLabel='tertiary large disabled'>
                Tertiary L
            </Button>
            <Button design="tertiary" size="medium" disabled={true} ariaLabel='tertiary medium disabled'>
                Tertiary
            </Button>
            <Button design="tertiary" size="small" disabled={true} ariaLabel='tertiary small disabled'>
                Tertiary S
            </Button>
        </>
    );
});
