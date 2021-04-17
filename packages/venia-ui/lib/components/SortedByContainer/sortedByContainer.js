import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { mergeClasses } from "../../classify";
import defaultClasses from "./sortedByContainer.css";

const SortedByContainer = props  => {
    const {
        shouldDisplay,
        currentSort
    } = props;

    if (!shouldDisplay) {
        return null;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <span className={classes.root}>
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
        </span>
    );
}

export default SortedByContainer;

SortedByContainer.propTypes = {
    shouldDisplay: PropTypes.bool,
    currentSort: PropTypes.shape({
        sortId: PropTypes.string,
        sortText: PropTypes.string
    })
}
