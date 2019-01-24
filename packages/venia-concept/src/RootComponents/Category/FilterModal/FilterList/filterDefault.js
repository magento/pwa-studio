import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import Checkmark from 'react-feather/dist/icons/check';
import classify from 'src/classify';
import defaultClasses from './filterDefault.css';

class FilterDefault extends Component {
    state = {
        isActive: false
    };

    updateFilterState = state => this.setState({ isActive: state });

    componentWillUnmount = () => console.log('UIN');

    handleFilterToggle = event => {
        const { isActive } = this.state;
        this.props.toggleOption(event);
        this.updateFilterState(!isActive);
    };

    render() {
        const { value_string, label, classes, group } = this.props;

        const { isActive } = this.state;

        const { handleFilterToggle } = this;

        return (
            <button
                className={classes.root}
                value={value_string}
                data-group={group}
                title={label}
                onClick={handleFilterToggle}
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
    }
}

export default classify(defaultClasses)(FilterDefault);
