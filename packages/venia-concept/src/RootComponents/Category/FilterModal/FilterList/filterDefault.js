import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import Checkmark from 'react-feather/dist/icons/check';
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
        className={classes.root}
        value={value_string}
        title={label}
        onClick={toggleOption}
    >
        <span className={isActive ? classes.iconActive : classes.icon}>
            {isActive && <Icon src={Checkmark} size={14} />}
        </span>
        <span
            dangerouslySetInnerHTML={{
                __html: label
            }}
        />
    </button>
);

export default classify(defaultClasses)(FilterDefault);
