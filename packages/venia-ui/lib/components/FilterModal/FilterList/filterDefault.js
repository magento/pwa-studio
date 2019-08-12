import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Icon';
import { Check as Checkmark } from 'react-feather';
import classify from '../../../classify';
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
