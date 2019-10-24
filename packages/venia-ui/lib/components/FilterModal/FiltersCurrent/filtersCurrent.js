import React, { useCallback, useMemo } from 'react';
import { object, shape, string } from 'prop-types';
import Icon from '../../Icon';
import { X as Remove } from 'react-feather';
import { mergeClasses } from '../../../classify';
import { withRouter } from 'react-router-dom';
import defaultClasses from './filtersCurrent.css';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';

const FiltersCurrent = props => {
    const { history, keyPrefix, location } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ chosenFilterOptions }, { removeFilter }] = useCatalogContext();

    const removeOption = useCallback(
        event => {
            const { title, value, dataset } =
                event.currentTarget || event.srcElement;
            const { group } = dataset;
            removeFilter({ title, value, group }, history, location);
        },
        [history, location, removeFilter]
    );

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
                                onClick={removeOption}
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
            removeOption
        ]
    );

    return <ul className={classes.root}>{chosenFilters}</ul>;
};

FiltersCurrent.propTypes = {
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
