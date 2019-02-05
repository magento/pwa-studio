import React, { Component } from 'react';
import classify from 'src/classify';
import defaultClasses from './notificationStack.css';

class NotificationStack extends Component {
    render() {
        const { children, classes } = this.props;
        return <div className={classes.root}>{children}</div>;
    }
}

export default classify(defaultClasses)(NotificationStack);
