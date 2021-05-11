import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '../../classify';
import defaultClasses from './sortedByContainer.css';

const SortedByContainer = props => {
    const { currentSort } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <FormattedMessage
                id={'searchPage.sortContainer'}
                defaultMessage={'Items sorted by '}
            />
            <span className={classes.sortText}>
                <FormattedMessage
                    id={currentSort.sortId}
                    defaultMessage={currentSort.sortText}
                />
            </span>
        </div>
    );
};

export default SortedByContainer;

SortedByContainer.propTypes = {
    shouldDisplay: PropTypes.bool,
    currentSort: PropTypes.shape({
        sortId: PropTypes.string,
        sortText: PropTypes.string
    })
};
