import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import Checkmark from 'react-feather/dist/icons/check';
import classify from 'src/classify';
import defaultClasses from './filterDefault.css';

class FilterDefault extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            icon: PropTypes.string,
            iconActive: PropTypes.string
        }),
        isActive: PropTypes.bool,
        toggleOption: PropTypes.func,
        value_string: PropTypes.string,
        label: PropTypes.string,
        group: PropTypes.string
    };

    render() {
        const {
            value_string,
            toggleOption,
            label,
            classes,
            group,
            isActive
        } = this.props;

        const iconClassName = isActive ? classes.iconActive : classes.icon;

        return (
            <button
                className={classes.root}
                value={value_string}
                data-group={group}
                title={label}
                onClick={toggleOption}
            >
                <span className={iconClassName}>
                    {isActive && <Icon src={Checkmark} size={14} />}
                </span>
                <span
                    dangerouslySetInnerHTML={{
                        __html: label
                    }}
                />
            </button>
        );
    }
}

export default classify(defaultClasses)(FilterDefault);
