import React, { useCallback, useState } from 'react';
import { storiesOf } from '@storybook/react';

import Dialog from '../dialog';
import TextInput from '../../TextInput';
import './dialog.css';

const stories = storiesOf('Components/Dialog', module);

/*
 *  Member variables.
 */
const onConfirm = () => alert('User Action: Confirm!');
const onCancel = () => alert('User Action: Cancel!');

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
            <h2>Header</h2>
            <p>Its header has a title and a "cancel" X button.</p>
            <p>
                Clicking the button will call the `onCancel` callback function
                provided. The caller is responsible for closing the Dialog.
            </p>
            <p>
                Clicking the "cancel" X button also resets the Dialog's internal
                Form component.
            </p>

            <h2>Body</h2>
            <p>
                The main content area here is the body and will render any
                children passed to the Dialog.
            </p>
            <p>
                At the end of the children content the Dialog displays "Cancel"
                and "Confirm" buttons. The text of these buttons is
                configurable.
            </p>
            <p>
                Clicking the "Cancel" button will call the `onCancel` callback
                function provided. The caller is responsible for closing the
                Dialog. It will also reset the Dialog's internal Form component.
            </p>
            <p>
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
                <p>
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
        <p>
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
            <h2>Buttons</h2>
            <p>
                The buttons are not always visible. When a Dialog has a lot of
                content like this, it will expand vertically to try to fit it
                all. If it runs out of room the body will scroll its contents
                and users will have to scroll to the end of the content to
                interact with the Dialog's buttons.
            </p>

            <h2>This is a test</h2>
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

stories.add('Modal mode', () => {
    return (
        <Dialog
            onCancel={onCancel}
            onConfirm={onConfirm}
            isModal={true}
            isOpen={true}
            title={'Modal mode'}
        >
            <span>
                If the Dialog is set to be a Modal via the `isModal` prop,
                clicking the mask (gray) area behind it will not cause the
                `onCancel` callback function to be called.
            </span>
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
            <p>
                The form below has its `input` element intialized to a specific
                value.
            </p>
            <p>
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
    const simulatedNetworkCall = () => {
        return new Promise(resolve => {
            setTimeout(() => resolve(), 5000);
        });
    };

    const CallingComponent = () => {
        const [isUpdating, setIsUpdating] = useState(false);
        const [isOpen, setIsOpen] = useState(true);

        const closeDialog = useCallback(async () => {
            setIsOpen(false);
        }, []);

        const makeNetworkCall = useCallback(async () => {
            setIsUpdating(true);
            await simulatedNetworkCall();
            setIsOpen(false);
        }, []);

        return (
            <Dialog
                shouldDisableButtons={isUpdating}
                onCancel={closeDialog}
                onConfirm={makeNetworkCall}
                isOpen={isOpen}
                title={'Closing the Dialog'}
            >
                <p>
                    The caller controls whether the buttons are disabled. Click
                    the Dialog's "Confirm" button to simulate a network call
                    that takes five seconds.
                </p>
            </Dialog>
        );
    };

    return <CallingComponent />;
});
