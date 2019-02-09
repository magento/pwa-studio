import React, { Component } from 'react';
import { arrayOf, object, func, shape, string } from 'prop-types';
import AlertCircle from 'react-feather/dist/icons/alert-circle';
import classify from 'src/classify';
import { Notification, NotificationStack } from 'src/components/Notifications';
import defaultClasses from './errorNotifications.css';

class ErrorNotifications extends Component {
    static propTypes = {
        classes: shape({
            debuginfo: string
        }).isRequired,
        errors: arrayOf(
            shape({
                error: object.isRequired,
                id: string.isRequired,
                loc: string
            })
        ),
        onDismissError: func.isRequired
    };

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { classes, onDismissError, errors } = this.props;
        if (errors.length > 0) {
            // TODO: Put this side effect and the console log
            // somewhere else, but for now this is what makes sense.
            return (
                <NotificationStack>
                    {errors.map(({ error, id, loc }) => (
                        <Notification
                            key={id}
                            type="error"
                            icon={AlertCircle}
                            onClick={(e, dismiss) => {
                                e.preventDefault();
                                e.stopPropagation();
                                dismiss();
                            }}
                            afterDismiss={() => onDismissError(error)}
                        >
                            <div>Sorry! An unexpected error occurred.</div>
                            <small className={classes.debuginfo}>
                                Debug: {id} {loc}
                            </small>
                        </Notification>
                    ))}
                </NotificationStack>
            );
        }
        return null;
    }
}

export default classify(defaultClasses)(ErrorNotifications);
