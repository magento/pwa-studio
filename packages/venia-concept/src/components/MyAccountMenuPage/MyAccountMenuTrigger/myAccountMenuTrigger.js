import React, { Component } from 'react';
import { compose } from 'redux';
import withToggle from 'src/components/withToggle';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import defaultClasses from './myAccountMenuTrigger.css';
import UserInformation from '../UserInformation';
import MyAccountMenuPage from '../MyAccountMenuPage';
import { USER_PROP_TYPES } from '../constants';

class MyAccountMenuTrigger extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        on: PropTypes.func,
        setOff: PropTypes.func,
        setOn: PropTypes.func,
        classes: PropTypes.shape({
            userChip: PropTypes.string,
            userMore: PropTypes.string,
            menuOpen: PropTypes.string,
            menuClosed: PropTypes.string
        }),
        user: PropTypes.shape(USER_PROP_TYPES)
    };

    get menu() {
        const { classes, setOff, on } = this.props;
        const menuContainerClassName = on
            ? classes.menuOpen
            : classes.menuClosed;

        return (
            <div className={menuContainerClassName}>
                <MyAccountMenuPage onClose={setOff} />
            </div>
        );
    }

    render() {
        const { menu } = this;
        const { user, classes, setOn } = this.props;

        return (
            <div>
                <div className={classes.userChip}>
                    <UserInformation user={user} />
                    <button className={classes.userMore} onClick={setOn}>
                        <Icon name="chevron-up" />
                    </button>
                </div>
                {menu}
            </div>
        );
    }
}

export default compose(
    classify(defaultClasses),
    withToggle
)(MyAccountMenuTrigger);
