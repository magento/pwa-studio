import React, { Component } from 'react';
import { compose } from 'redux';
import withOpenState from 'src/components/withOpenState';
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
        open: PropTypes.func,
        close: PropTypes.func,
        classes: PropTypes.shape({
            userChip: PropTypes.string,
            userMore: PropTypes.string,
            menuOpen: PropTypes.string,
            menuClosed: PropTypes.string
        }),
        user: PropTypes.shape(USER_PROP_TYPES)
    };

    get menu() {
        const { classes, close, isOpen } = this.props;
        const menuContainerClassName = isOpen
            ? classes.menuOpen
            : classes.menuClosed;

        return (
            <div className={menuContainerClassName}>
                <MyAccountMenuPage onClose={close} />
            </div>
        );
    }

    render() {
        const { menu } = this;
        const { user, classes, open } = this.props;

        return (
            <div>
                <div className={classes.userChip}>
                    <UserInformation user={user} />
                    <button className={classes.userMore} onClick={open}>
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
    withOpenState()
)(MyAccountMenuTrigger);
