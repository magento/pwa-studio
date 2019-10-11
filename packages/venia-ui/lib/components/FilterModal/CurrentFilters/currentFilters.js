import React, { useMemo } from 'react';
import { object, shape, string } from 'prop-types';
import Icon from '../../Icon';
import { X as Remove } from 'react-feather';
import { mergeClasses } from '../../../classify';
import { withRouter } from 'react-router-dom';
import defaultClasses from './currentFilters.css';
import { useCurrentFilters } from '@magento/peregrine/lib/talons/FilterModal/CurrentFilters/useCurrentFilters';

const CurrentFilters = props => {
    const { history, keyPrefix, location } = props;

    const talonProps = useCurrentFilters({
        history,
        location
    });

    const { chosenFilterOptions, handleRemoveOption } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const chosenFilters = useMemo(
        () =>
            Object.keys(chosenFilterOptions).map(key =>
                chosenFilterOptions[key].map(item => {
                    const { title, value } = item;

                    return (
                        <li
                            className={classes.item}
                            key={`${keyPrefix}-${title}-${value}`}
                        >
                            <button
                                className={classes.button}
                                onClick={handleRemoveOption}
                                data-group={key}
                                title={title}
                                value={value}
                            >
                                <Icon
                                    className={classes.icon}
                                    src={Remove}
                                    size={16}
                                />
                                <span>{title}</span>
                            </button>
                        </li>
                    );
                })
            ),
        [
            classes.button,
            classes.icon,
            classes.item,
            chosenFilterOptions,
            keyPrefix,
            handleRemoveOption
        ]
    );

    return <ul className={classes.root}>{chosenFilters}</ul>;
};

CurrentFilters.propTypes = {
    classes: shape({
        root: string,
        item: string,
        button: string,
        icon: string
    }),
    history: object,
    keyPrefix: string,
    location: object
};

export default withRouter(FiltersCurrent);
