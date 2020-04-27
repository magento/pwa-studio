import React from 'react';
import { storiesOf } from '@storybook/react';

import Dialog from '../dialog';

const stories = storiesOf('Components/Dialog', module);

/*
 *  Member variables.
 */
const handleConfirm = () => console.log('User: Confirm');
const handleCancel = () => console.log('User: Cancel');

/*
 *  Story definitions.
 */

stories.add('Default', () => {
    const dialogContents = <span>Dialog Contents Here</span>;

    return (
        <Dialog
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            isOpen={true}
            title={'A Dialog with Sparse Content'}
        >
            {dialogContents}
        </Dialog>
    );
});

stories.add('Overflowing Body', () => {
    const dialogContents = (
        <>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
            <div>Scroll down to see the Dialog buttons.</div>
        </>
    );

    return (
        <Dialog
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
            isOpen={true}
            title={'Must Scroll to See Buttons'}
        >
            {dialogContents}
        </Dialog>
    );
});
