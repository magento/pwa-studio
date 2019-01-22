import React from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './filterDefault.css';

const FilterDefault = ({
    value_string,
    toggleOption,
    label,
    classes,
    isActive
}) => (
    <button
        className={isActive ? classes.rootActive : classes.root}
        value={value_string}
        onClick={toggleOption}
    >
        <span
            dangerouslySetInnerHTML={{
                __html: label
            }}
        />
    </button>
);

export default classify(defaultClasses)(FilterDefault);
