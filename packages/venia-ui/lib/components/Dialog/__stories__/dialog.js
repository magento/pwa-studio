/* eslint-disable react/jsx-no-literals */
import React, { useCallback, useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';

import Dialog from '../dialog';
import TextInput from '../../TextInput';
import classes from './dialog.module.css';

const stories = storiesOf('Components/Dialog', module);

/*
 *  Member variables.
 */
const onConfirm = () => alert('User Action: Confirm!');
const onCancel = () => alert('User Action: Cancel!');

const simulatedNetworkCall = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), 5000);
    });
};

/*
 *  Story definitions.
 */

stories.add('Default', () => {
    return (
        <Dialog
            onCancel={onCancel}
            onConfirm={onConfirm}
            isOpen={true}
            title={'This is a Dialog'}
        >
            <strong>Header</strong>
            <p className={classes.paragraph}>
                Its header has a title and a "cancel" X button.
            </p>
            <p className={classes.paragraph}>
                Clicking the button will call the `onCancel` callback function
                provided. The caller is responsible for closing the Dialog.
            </p>
            <p className={classes.paragraph}>
                Clicking the "cancel" X button also resets the Dialog's internal
                Form component.
            </p>
            <br />

            <strong>Body</strong>
            <p className={classes.paragraph}>
                The main content area here is the body and will render any
                children passed to the Dialog.
            </p>
            <p className={classes.paragraph}>
                At the end of the children content the Dialog displays "Cancel"
                and "Confirm" buttons. The text of these buttons is
                configurable.
            </p>
            <p className={classes.paragraph}>
                Clicking the "Cancel" button will call the `onCancel` callback
                function provided. The caller is responsible for closing the
                Dialog. It will also reset the Dialog's internal Form component.
            </p>
            <p className={classes.paragraph}>
                Clicking the "Confirm" button will call the `onConfirm` callback
                function provided by submitting the form. The caller is
                responsible for closing the Dialog.
            </p>
        </Dialog>
    );
});

stories.add('Closing the Dialog', () => {
    const CallingComponent = () => {
        const [isOpen, setIsOpen] = useState(true);

        const closeDialog = useCallback(() => {
            setIsOpen(false);
        }, []);

        return (
            <Dialog
                onCancel={closeDialog}
                onConfirm={closeDialog}
                isOpen={isOpen}
                title={'Closing the Dialog'}
            >
                <p className={classes.paragraph}>
                    The caller is responsible for closing the Dialog, usually in
                    the `onCancel` and `onConfirm` callbacks. Click any of the
                    Dialog's buttons or the mask behind to close the Dialog.
                </p>
            </Dialog>
        );
    };

    return <CallingComponent />;
});

stories.add('Lots of Content', () => {
    const longContent = new Array(50).fill(
        <p className={classes.paragraph}>
            Here is some dummy content to simulate having to scroll down to
            interact with the Dialog buttons.
        </p>
    );

    return (
        <Dialog
            onCancel={onCancel}
            onConfirm={onConfirm}
            isOpen={true}
            title={'Lots of Content'}
        >
            <strong>Buttons</strong>
            <p className={classes.paragraph}>
                The buttons are not always visible. When a Dialog has a lot of
                content like this, it will expand vertically to try to fit it
                all. If it runs out of room the body will scroll its contents
                and users will have to scroll to the end of the content to
                interact with the Dialog's buttons.
            </p>

            <strong>This is a test</strong>
            {longContent}
        </Dialog>
    );
});

stories.add('Customizing the Button Texts', () => {
    return (
        <Dialog
            cancelText={'No, I do not approve at all'}
            confirmText={'Yes, I approve'}
            onCancel={onCancel}
            onConfirm={onConfirm}
            isOpen={true}
            title={'Customizing the Button Texts'}
        >
            <span>Consumers can set the text of the buttons.</span>
        </Dialog>
    );
});

stories.add('Hiding the Action Buttons', () => {
    return (
        <Dialog
            onCancel={onCancel}
            isOpen={true}
            shouldShowButtons={false}
            title={'Customizing the Button Texts'}
        >
            <span>Consumers can hide the bottom action buttons</span>
        </Dialog>
    );
});

stories.add('Modal mode', () => {
    return (
        <Dialog
            cancelText={'No'}
            confirmText={'Yes'}
            onCancel={() => alert('The user said No.')}
            onConfirm={() => alert('The user said Yes.')}
            isModal={true}
            isOpen={true}
            title={'Modal mode'}
        >
            <p className={classes.paragraph}>
                If the Dialog is set to be a Modal via the `isModal` prop, the
                close "X" button will not appear and the mask (gray) area will
                not be clickable.
            </p>
            <p className={classes.paragraph}>
                In Modal mode, the "Cancel" button / `onCancel` callback is more
                of an active, explicit rejection by the user than a passive
                cancel action.
            </p>
        </Dialog>
    );
});

stories.add('Seeding the Dialog Form with values', () => {
    const initialValues = { name: 'This is an initial value. Change me!' };
    const formProps = { initialValues };

    return (
        <Dialog
            formProps={formProps}
            isOpen={true}
            title={'Seeding the Dialog Form with Values'}
        >
            <p className={classes.paragraph}>
                The form below has its `input` element intialized to a specific
                value.
            </p>
            <p className={classes.paragraph}>
                Change the value and click one of the "cancel" buttons to see
                how the form resets back to its initial values.
            </p>
            <br />
            <br />
            <TextInput field="name" />
        </Dialog>
    );
});

stories.add('Disabling Buttons', () => {
    const CallingComponent = () => {
        const [isUpdating, setIsUpdating] = useState(false);
        const [isOpen, setIsOpen] = useState(true);

        const closeDialog = useCallback(() => {
            setIsOpen(false);
        }, []);

        const makeNetworkCall = useCallback(async () => {
            setIsUpdating(true);
            await simulatedNetworkCall();
            setIsOpen(false);
        }, []);

        return (
            <Dialog
                shouldDisableAllButtons={isUpdating}
                onCancel={closeDialog}
                onConfirm={makeNetworkCall}
                isOpen={isOpen}
                title={'Disabling Buttons'}
            >
                <p className={classes.paragraph}>
                    The caller controls whether the buttons are disabled.
                </p>
                <p className={classes.paragraph}>
                    Click the Dialog's "Confirm" button to simulate a network
                    call that takes five seconds.
                </p>
                <p className={classes.paragraph}>
                    Note that this affects all buttons: confirm, cancel, close
                    X, and mask.
                </p>
            </Dialog>
        );
    };

    return <CallingComponent />;
});

stories.add('Disabling the Confirm button only', () => {
    const StoryComponent = () => {
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const fetchData = async () => {
                await simulatedNetworkCall();
                setIsLoading(false);
            };

            fetchData();
        }, []);

        const text = isLoading
            ? 'The contents of this dialog are loading. The user can close the Dialog if loading takes too long.'
            : 'The contents of this dialog have loaded. The confirm button is now enabled.';

        return (
            <Dialog
                isOpen={true}
                onCancel={onCancel}
                onConfirm={onConfirm}
                shouldDisableConfirmButton={isLoading}
                title={'Disabling the Confirm button only'}
            >
                {text}
            </Dialog>
        );
    };

    return <StoryComponent />;
});
