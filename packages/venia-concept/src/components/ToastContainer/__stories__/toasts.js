import React, { useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import ToastContainer from '../toastContainer';
import { ToastContextProvider, useToasts } from '@magento/peregrine';
import SmileIcon from 'react-feather/dist/icons/smile';

const stories = storiesOf('Toasts', module);

const ToastEmitter = ({
    actionText,
    dismissable,
    message = 'Hello, World!',
    onAction,
    onDismiss,
    timeout = 0,
    type = 'info'
}) => {
    const [, { addToast }] = useToasts();

    const toastProps = {
        actionText,
        dismissable,
        icon: SmileIcon,
        message,
        onAction,
        onDismiss,
        timeout,
        type
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
            <ToastEmitter type={'info'} timeout={3000} />
            <ToastEmitter type={'warning'} timeout={3000} />
            <ToastEmitter type={'error'} timeout={3000} />
            <ToastContainer />
        </ToastContextProvider>
    );
});

stories.add('Toasts w/ Call To Action', () => {
    return (
        <ToastContextProvider>
            <ToastEmitter
                type={'error'}
                onAction={remove => {
                    remove();
                    alert('Action click!');
                }}
                actionText={'Click me!'}
            />
            <ToastContainer />
        </ToastContextProvider>
    );
});

stories.add('Toasts w/ Async Action/Dismiss', () => {
    return (
        <ToastContextProvider>
            <ToastEmitter
                type={'error'}
                message={'I should close _after_ the action callback is done.'}
                onAction={async remove => {
                    await new Promise(resolve => {
                        setTimeout(() => resolve(), 1000);
                    });
                    remove();
                }}
                actionText={'An async action!'}
            />
            <ToastEmitter
                type={'info'}
                message={'I should close _after_ the dismiss callback is done.'}
                onDismiss={async remove => {
                    await new Promise(resolve => {
                        setTimeout(() => resolve(), 1000);
                    });
                    remove();
                }}
            />
            <ToastEmitter
                type={'info'}
                message={
                    'Im async but should remove immediately before the alert.'
                }
                onDismiss={async remove => {
                    remove();
                    await new Promise(resolve => {
                        setTimeout(() => resolve(), 1000);
                    });
                    alert('Dismiss callback after 1 second!');
                }}
            />
            <ToastContainer />
        </ToastContextProvider>
    );
});

stories.add('Toasts w/ Wrapping Text', () => {
    return (
        <ToastContextProvider>
            <ToastEmitter
                dismissable={true}
                message={'A message that doesnt wrap.'}
                type={'info'}
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
                timeout={3000}
            />
            <ToastEmitter
                type={'error'}
                message={'A short message with an action.'}
                dismissable={true}
                onAction={remove => {
                    remove();
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
                onAction={remove => {
                    remove();
                    alert('Action click!');
                }}
                actionText={'Click me!'}
            />
            <ToastEmitter
                type={'error'}
                message={
                    'Some really long text that wraps but in a toast that is not dismissable but has an action.'
                }
                onAction={remove => {
                    remove();
                    alert('Action click!');
                }}
                actionText={'Click me!'}
                timeout={3000}
            />
            <ToastContainer />
        </ToastContextProvider>
    );
});
