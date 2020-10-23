import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '../../classify';
import defaultClasses from './notFound.css';

const NotFound = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { history } = window;

    const handleGoBack = useCallback(() => {
        history.back();
    }, [history]);

    return (
        <div className={classes.root}>
            <h1>
                <FormattedMessage
                    id={'notFound.offline'}
                    defaultMessage={'Offline'}
                />
            </h1>
            <button onClick={handleGoBack}>
                <FormattedMessage
                    id={'notFound.goBack'}
                    defaultMessage={'Go Back'}
                />
            </button>
        </div>
    );
};

// TODO: Should not be a default here, we just don't have
// the wiring in place to map route info down the tree (yet)
NotFound.defaultProps = {
    id: 3
};

export default NotFound;
