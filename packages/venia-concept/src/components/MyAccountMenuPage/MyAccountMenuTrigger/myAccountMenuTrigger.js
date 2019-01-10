import React, { Fragment, Component } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import defaultClasses from './myAccountMenuTrigger.css';
import UserInformation from '../UserInformation';
import MyAccountMenuPage from '../MyAccountMenuPage';
import ChevronUpIcon from 'react-feather/dist/icons/chevron-up';

class MyAccountMenuTrigger extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            userChip: PropTypes.string,
            userMore: PropTypes.string,
            menuOpen: PropTypes.string,
            menuClosed: PropTypes.string
        }),
        user: PropTypes.shape({
            email: PropTypes.string,
            firstname: PropTypes.string,
            lastname: PropTypes.string,
            fullname: PropTypes.string
        })
    };

    get menu() {
        const { classes } = this.props;

        const menuContainerClassName = this.state.on
            ? classes.menuOpen
            : classes.menuClosed;

        return (
            <div className={menuContainerClassName}>
                <MyAccountMenuPage onClose={this.toggle} />
            </div>
        );
    }

    state = {
        on: false
    };

    toggle = () => {
        this.setState({
            on: !this.state.on
        });
    };

    render() {
        const { menu } = this;
        const { user, classes } = this.props;

        return (
            <Fragment>
                <div className={classes.userChip}>
                    <UserInformation user={user} />
                    <button className={classes.userMore} onClick={this.toggle}>
                        <Icon src={ChevronUpIcon} />
                    </button>
                </div>
                {menu}
            </Fragment>
        );
    }
}

export default compose(classify(defaultClasses))(MyAccountMenuTrigger);
