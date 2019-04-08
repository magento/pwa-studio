import React from 'react';
import { storiesOf } from '@storybook/react';

import 'src/index.css';
import ErrorNotifications from '../errorNotifications';

const stories = storiesOf('App/ErrorNotifications', module);

class MockPageWithErrors extends React.Component {
    styles = {
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
    state = {
        text: 'Click errors to dismiss and show side effect',
        handledErrors: []
    };
    handleDismissError = error => {
        this.setState({
            text: `Dismissed ${error.message}`,
            handledErrors: [...this.state.handledErrors, error]
        });
    };
    render() {
        const { handleDismissError, styles, state, props } = this;
        const { handledErrors, text } = state;
        const { errors } = props;
        return (
            <div style={styles.container}>
                <header className="mockHeader" style={styles.header}>
                    Header
                </header>
                <ErrorNotifications
                    errors={errors.filter(
                        record =>
                            !handledErrors.some(error => record.error === error)
                    )}
                    onDismissError={handleDismissError}
                />
                <h2 style={{ marginTop: '80px', textAlign: 'center' }}>
                    {text}
                </h2>
            </div>
        );
    }
}

stories.add('Displays stack of notifications and debug info', () => (
    <MockPageWithErrors
        errors={[
            {
                error: new Error('first error'),
                id: 'Error1',
                loc: 'stack trace here'
            },
            {
                error: new Error('second error'),
                id: 'Error2',
                loc: 'stack trace here 2'
            }
        ]}
    />
));
