import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { ChevronDown as ArrowDown } from 'react-feather';

import Icon from '../../Icon';
import { useStyle } from '../../../classify';

import defaultClasses from './showAllButton.module.css';

const ShowAllButton = props => {
    const { onClick } = props;
    const classes = useStyle(defaultClasses, props.classes || {});

    const handleClick = useCallback(() => {
        onClick();
    }, [onClick]);

    return (
        <button className={classes.root} onClick={handleClick}>
            <span className={classes.content}>
                <span className={classes.text}>
                    <FormattedMessage
                        id={'checkoutPage.showAllItems'}
                        defaultMessage={'SHOW ALL ITEMS'}
                    />
                </span>
                <Icon
                    src={ArrowDown}
                    classes={{
                        root: classes.arrowDown
                    }}
                />
            </span>
        </button>
    );
};

export default ShowAllButton;
