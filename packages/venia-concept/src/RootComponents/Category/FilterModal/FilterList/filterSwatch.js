import React from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './filterSwatch.css';

const cache = new Map();

const memoize = fn => key =>
    cache.has(key) ? cache.get(key) : cache.set(key, fn(key)).get(key);

const getRandomColor = () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 255)).join(',');

const memoizedGetRandomColor = memoize(getRandomColor);

const FilterSwatch = ({ value_string, toggleOption, label, icon, options }) => (
    <button value={value_string} onClick={toggleOption}>
        {icon}
        {options.showLabel && (
            <span
                dangerouslySetInnerHTML={{
                    __html: label
                }}
            />
        )}
        {options.generateColor && (
            <span
                style={{
                    backgroundColor: `rgb(${memoizedGetRandomColor(
                        value_string
                    )})`,
                    display: 'block',
                    width: '20px',
                    height: '20px'
                }}
            />
        )}
    </button>
);

export default classify(defaultClasses)(FilterSwatch);
