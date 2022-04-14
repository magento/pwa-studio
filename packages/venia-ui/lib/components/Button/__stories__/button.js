import React from 'react';

import Button from '../button';

import { storiesOf } from '@storybook/react';

const stories = storiesOf('Components/Button', module);

stories.add('Action', () => {
    return (
        <>
            <h2>Enabled</h2>
            <Button design="action">Action</Button>
            <h2>Disabled</h2>
            <Button design="action" disabled={true}>
                Action
            </Button>
        </>
    );
});

stories.add('Marketing', () => {
    return (
        <>
            <h2>Enabled</h2>
            <Button design="marketing">Marketing</Button>
            <h2>Disabled</h2>
            <Button design="marketing" disabled={true}>
                Marketing
            </Button>
        </>
    );
});

stories.add('Primary', () => {
    return (
        <>
            <h2>Enabled</h2>
            <Button design="primary" size="large">
                Primary L
            </Button>
            <Button design="primary" size="medium">
                Primary
            </Button>
            <Button design="primary" size="small">
                Primary S
            </Button>
            <h2>Disabled</h2>
            <Button design="primary" size="large" disabled={true}>
                Primary L
            </Button>
            <Button design="primary" size="medium" disabled={true}>
                Primary
            </Button>
            <Button design="primary" size="small" disabled={true}>
                Primary S
            </Button>
            <h2>Negative</h2>
            <Button design="primary" size="large" negative={true}>
                Primary L
            </Button>
            <Button design="primary" size="medium" negative={true}>
                Primary
            </Button>
            <Button design="primary" size="small" negative={true}>
                Primary S
            </Button>
        </>
    );
});

stories.add('Secondary', () => {
    return (
        <>
            <h2>Enabled</h2>
            <Button design="secondary" size="large">
                Secondary L
            </Button>
            <Button design="secondary" size="medium">
                Secondary
            </Button>
            <Button design="secondary" size="small">
                Secondary S
            </Button>
            <h2>Disabled</h2>
            <Button design="secondary" size="large" disabled={true}>
                Secondary L
            </Button>
            <Button design="secondary" size="medium" disabled={true}>
                Secondary
            </Button>
            <Button design="secondary" size="small" disabled={true}>
                Secondary S
            </Button>
            <h2>Negative</h2>
            <Button design="secondary" size="large" negative={true}>
                Secondary L
            </Button>
            <Button design="secondary" size="medium" negative={true}>
                Secondary
            </Button>
            <Button design="secondary" size="small" negative={true}>
                Secondary S
            </Button>
        </>
    );
});

stories.add('Quiet', () => {
    return (
        <>
            <h2>Enabled</h2>
            <Button design="quiet" size="large">
                Quiet L
            </Button>
            <Button design="quiet" size="medium">
                Quiet
            </Button>
            <Button design="quiet" size="small">
                Quiet S
            </Button>
            <h2>Disabled</h2>
            <Button design="quiet" size="large" disabled={true}>
                Quiet L
            </Button>
            <Button design="quiet" size="medium" disabled={true}>
                Quiet
            </Button>
            <Button design="quiet" size="small" disabled={true}>
                Quiet S
            </Button>
            <h2>Negative</h2>
            <Button design="quiet" size="large" negative={true}>
                Quiet L
            </Button>
            <Button design="quiet" size="medium" negative={true}>
                Quiet
            </Button>
            <Button design="quiet" size="small" negative={true}>
                Quiet S
            </Button>
        </>
    );
});
