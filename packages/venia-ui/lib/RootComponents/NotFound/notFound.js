import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { mergeClasses } from '../../classify';
import Button from '@magento/venia-ui/lib/components/Button';

import defaultClasses from './notFound.css';

const DEFAULT_HEADER = 'Well, dang.';
const DEFAULT_MESSAGE =
    'The page you are looking for has been removed or renamed. Sorry about that!';

/**
 * The Not Found component can be rendered in place of an unknown route.
 * @param {*} props
 */
const NotFound = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { header = DEFAULT_HEADER, message = DEFAULT_MESSAGE } = props;
    const history = useHistory();

    const handleGoHome = useCallback(() => {
        history.push('/');
    }, [history]);

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <h1>{header}</h1>
                <p>{message}</p>
                <div>
                    <Button
                        priority="high"
                        type="button"
                        onClick={handleGoHome}
                    >
                        <FormattedMessage
                            id={'notFound.goHome'}
                            defaultMessage={"There's no place like home"}
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
};

// TODO: Should not be a default here, we just don't have
// the wiring in place to map route info down the tree (yet)
NotFound.defaultProps = {
    id: 3
};

export default NotFound;
