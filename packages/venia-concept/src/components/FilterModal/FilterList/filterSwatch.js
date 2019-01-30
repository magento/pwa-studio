import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import Checkmark from 'react-feather/dist/icons/check';
import classify from 'src/classify';
import defaultClasses from './filterSwatch.css';

const cache = new Map();

const memoize = fn => key =>
    cache.has(key) ? cache.get(key) : cache.set(key, fn(key)).get(key);

const getRandomColor = () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 255)).join(',');

const memoizedGetRandomColor = memoize(getRandomColor);

const FilterSwatch = ({
    options,
    isActive,
    toggleOption,
    value_string,
    label,
    classes,
    group
}) => (
    <button
        className={classes.root}
        value={value_string}
        data-group={group}
        title={label}
        onClick={toggleOption}
    >
        {isActive && (
            <Fragment>
                <span
                    className={classes.swatchLabel}
                    dangerouslySetInnerHTML={{
                        __html: label
                    }}
                />
                <span className={classes.iconWrapper}>
                    <Icon src={Checkmark} size={36} />
                </span>
            </Fragment>
        )}
        {options.generateColor && (
            <span
                className={classes.swatch}
                style={{
                    backgroundColor: `rgb(${memoizedGetRandomColor(
                        value_string
                    )})`
                }}
            />
        )}
    </button>
);

export default classify(defaultClasses)(FilterSwatch);
