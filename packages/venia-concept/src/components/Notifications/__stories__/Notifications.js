import React from 'react';
import { storiesOf } from '@storybook/react';
import MessageIcon from 'react-feather/dist/icons/message-circle';

import { Notification, NotificationStack } from '../';
import 'src/index.css';

const stories = storiesOf('Notifications', module);

function MockPage({ children }) {
    const styles = {
        container: {
            margin: '0 auto',
            width: 480,
            height: 600,
            border: '1px solid gray',
            position: 'relative'
        },
        header: {
            padding: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            width: '100%',
            height: '3rem',
            background: 'lightgray'
        }
    };
    return (
        <div style={styles.container}>
            <header className="mockHeader" style={styles.header}>
                Header
            </header>
            {children}
        </div>
    );
}

stories.add('Success notification, click to dismiss', () => (
    <MockPage>
        <NotificationStack>
            <Notification type="success" onClick={(e, dismiss) => dismiss()}>
                Click to dismiss.
            </Notification>
        </NotificationStack>
    </MockPage>
));

stories.add('Warning notification, click to dismiss', () => (
    <MockPage>
        <NotificationStack>
            <Notification type="warning" onClick={(e, dismiss) => dismiss()}>
                Click to dismiss.
            </Notification>
        </NotificationStack>
    </MockPage>
));

stories.add('Error notification, click to dismiss', () => (
    <MockPage>
        <NotificationStack>
            <Notification type="error" onClick={(e, dismiss) => dismiss()}>
                Click to dismiss.
            </Notification>
        </NotificationStack>
    </MockPage>
));

stories.add(
    'Warning notification with custom icon, cannot be dismissed',
    () => (
        <MockPage>
            <NotificationStack>
                <Notification type="warning" icon={MessageIcon}>
                    Nothing you can really do about me.
                </Notification>
            </NotificationStack>
        </MockPage>
    )
);

stories.add('Warning notification, dismiss automatically', () => (
    <MockPage>
        <NotificationStack>
            <Notification
                type="warning"
                afterShow={(e, dismiss) => setTimeout(dismiss, 1000)}
            >
                Will dismiss in one second.
            </Notification>
        </NotificationStack>
    </MockPage>
));

stories.add('Error notification, has side effect after dismiss', () => (
    <MockPage>
        <NotificationStack>
            <Notification
                type="error"
                onClick={(e, dismiss) => dismiss()}
                afterDismiss={() => {
                    const header = document.querySelector('.mockHeader');
                    if (header) {
                        header.innerText = 'Side effect!!!';
                    }
                }}
            >
                Click to dismiss and change header text.
            </Notification>
        </NotificationStack>
    </MockPage>
));
