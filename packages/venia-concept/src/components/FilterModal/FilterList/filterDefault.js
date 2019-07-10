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
        item: PropTypes.shape({
            label: PropTypes.string
        }),
        isSelected: PropTypes.bool,
        label: PropTypes.string,
        group: PropTypes.string
    };

    render() {
        const {
            classes,
            isSelected,
            item: { label },
            ...rest
        } = this.props;

        const iconClassName = isSelected ? classes.iconActive : classes.icon;

        return (
            <button className={classes.root} {...rest}>
                <span className={iconClassName}>
                    {isSelected && <Icon src={Checkmark} size={14} />}
                </span>
                <span>{label}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(FilterDefault);
