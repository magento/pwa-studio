import React, { useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import ToastContainer from '../toastContainer';
import { ToastContextProvider, useToasts } from '@magento/peregrine';
import SmileIcon from 'react-feather/dist/icons/smile';

const stories = storiesOf('Toasts', module);

const ToastEmitter = ({
    actionText,
    dismissable,
    type = 'info',
    message = 'Hello, World!',
    onAction
}) => {
    const [, { addToast }] = useToasts();

    const toastProps = {
        type,
        message,
        icon: SmileIcon,
        dismissable,
        timeout: 10000,
        onAction,
        actionText
    };

    useEffect(() => {
        addToast(toastProps);
    }, []);

    return null;
};

stories.add('Dismissable Toasts', () => {
    return (
        <ToastContextProvider>
            <ToastEmitter type={'info'} dismissable={true} />
            <ToastEmitter type={'warning'} dismissable={true} />
            <ToastEmitter type={'error'} dismissable={true} />
            <ToastContainer />
        </ToastContextProvider>
    );
});

stories.add('Non-Dismissable Toasts', () => {
    return (
        <ToastContextProvider>
            <ToastEmitter type={'info'} />
            <ToastEmitter type={'warning'} />
            <ToastEmitter type={'error'} />
            <ToastContainer />
        </ToastContextProvider>
    );
});

stories.add('Toasts w/ Call To Action', () => {
    return (
        <ToastContextProvider>
            <ToastEmitter
                type={'error'}
                dismissable={true}
                onAction={() => {
                    alert('Action click!');
                }}
                actionText={'Click me!'}
            />
            <ToastContainer />
        </ToastContextProvider>
    );
});

stories.add('Toasts w/ Wrapping Text', () => {
    return (
        <ToastContextProvider>
            <ToastEmitter
                type={'info'}
                message={'A message that doesnt wrap.'}
                dismissable={true}
            />
            <ToastEmitter
                dismissable={true}
                message={
                    'Some really long text that wraps but in a toast that is dismissable.'
                }
            />

            <ToastEmitter
                message={
                    'Some really long text that wraps but in a toast that is not dismissable.'
                }
            />
            <ToastEmitter
                type={'error'}
                message={'A short message with an action.'}
                dismissable={true}
                onAction={() => {
                    alert('Action click!');
                }}
                actionText={'Click me!'}
            />
            <ToastEmitter
                type={'error'}
                message={
                    'Some really long text that wraps but in a toast that is dismissable and has an action.'
                }
                dismissable={true}
                onAction={() => {
                    alert('Action click!');
                }}
                actionText={'Click me!'}
            />
            <ToastEmitter
                type={'error'}
                message={
                    'Some really long text that wraps but in a toast that is not dismissable but has an action.'
                }
                onAction={() => {
                    alert('Action click!');
                }}
                actionText={'Click me!'}
            />
            <ToastContainer />
        </ToastContextProvider>
    );
});
