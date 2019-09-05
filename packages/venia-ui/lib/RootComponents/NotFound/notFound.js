import React, { useCallback } from 'react';
import { mergeClasses } from '../../classify';
import defaultClasses from './notFound.css';
import { withRouter } from '@magento/venia-drivers';
import { compose } from 'redux';

const NotFound = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { history } = props;

    const handleGoBack = useCallback(() => {
        history.back();
    }, [history]);

    return (
        <div className={classes.root}>
            <h1> Offline! </h1>
            <button onClick={handleGoBack}> Go Back </button>
        </div>
    );
};

// TODO: Should not be a default here, we just don't have
// the wiring in place to map route info down the tree (yet)
NotFound.defaultProps = {
    id: 3
};

export default compose(withRouter)(Category);
