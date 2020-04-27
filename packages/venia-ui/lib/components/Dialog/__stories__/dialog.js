import React from 'react';
import { storiesOf } from '@storybook/react';

import Dialog from '../dialog';

const stories = storiesOf('Components/Dialog', module);

/*
 *  Member variables.
 */
const onConfirm = () => console.log('User: Confirm');
const onCancel = () => console.log('User: Cancel');

/*
 *  Story definitions.
 */

stories.add('Default', () => {
    const dialogContents = <span>This is the minimum size a Dialog will be.</span>;

    return (
        <Dialog
            onCancel={onCancel}
            onConfirm={onConfirm}
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
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
            <div>This is a dialog with a lot of content. Scroll down to see the buttons.</div>
        </>
    );

    return (
        <Dialog
            onCancel={onCancel}
            onConfirm={onConfirm}
            isOpen={true}
            title={'Must Scroll to See Buttons'}
        >
            {dialogContents}
        </Dialog>
    );
});

stories.add('Custom Button Text', () => {
    const dialogContents = <span>Consumers can set the text of the buttons.</span>;

    return (
        <Dialog
            cancelText={'I do not approve'}
            confirmText={'Yes, I approve'}
            onCancel={onCancel}
            onConfirm={onConfirm}
            isOpen={true}
            title={'Custom Button Texts'}
        >
            {dialogContents}
        </Dialog>
    );
});

stories.add('Modal mode', () => {
    const dialogContents = (
        <span>
            If the Dialog is set to be a Modal via the `isModal` prop, clicking the mask (gray) area behind it will not close the Dialog.
        </span>
    );

    return (
        <Dialog
            onCancel={onCancel}
            onConfirm={onConfirm}
            isModal={true}
            isOpen={true}
            title={'Custom Button Texts'}
        >
            {dialogContents}
        </Dialog>
    );
});
