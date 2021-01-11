import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { func, number, oneOf, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './errorView.css';

const DEFAULT_HEADER = 'Well, dang.';
const DEFAULT_MESSAGE =
    'Looks like something went wrong. What would you like to do?';
const DEFAULT_PROMPT = 'Take me home';

const ErrorView = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const history = useHistory();

    const handleGoHome = useCallback(() => {
        history.push('/');
    }, [history]);

    const {
        code = '',
        header = DEFAULT_HEADER,
        message = DEFAULT_MESSAGE,
        buttonPrompt = (
            <FormattedMessage
                id={'errorView.goHome'}
                defaultMessage={DEFAULT_PROMPT}
            />
        ),
        onClick = handleGoHome
    } = props;

    const handleClick = useCallback(() => {
        onClick && onClick();
    }, [onClick]);

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <p className={classes.errorCode}>{code}</p>
                <p className={classes.header}>{header}</p>
                <p className={classes.message}>{message}</p>
                <div className={classes.actionsContainer}>
                    <Button priority="high" type="button" onClick={handleClick}>
                        {buttonPrompt}
                    </Button>
                </div>
            </div>
        </div>
    );
};

ErrorView.propTypes = {
    code: oneOf(string, number),
    header: string,
    message: string,
    buttonPrompt: string,
    onClick: func,
    classes: shape({
        root: string,
        content: string,
        errorCode: string,
        header: string,
        message: string,
        actionsContainer: string
    })
};

export default ErrorView;
