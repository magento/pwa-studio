import React, { Component } from 'react';
import classify from 'src/classify';
import defaultClasses from './notFound.css';

class NotFound extends Component {
    // TODO: Should not be a default here, we just don't have
    // the wiring in place to map route info down the tree (yet)
    static defaultProps = {
        id: 3
    };

    goBack() {
        history.back();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <h1> Offline! </h1>
                <button onClick={this.goBack}> Go Back </button>
            </div>
        );
    }
}

export default classify(defaultClasses)(NotFound);
