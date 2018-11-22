import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import defaultClasses from './myAccountMenuTrigger.css';
import UserInformation from '../UserInformation';
import MyAccountMenuPage from '../MyAccountMenuPage';

class MyAccountMenuTrigger extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            userChip: PropTypes.string,
            userMore: PropTypes.string
        }),
        user: PropTypes.shape({})
    };

    state = {
        isMenuOpen: false
    };

    get menu() {
        const { isMenuOpen } = this.state;

        if (!isMenuOpen) {
            return null;
        }

        return <MyAccountMenuPage onClose={this.closeMenu} />;
    }

    changeMenuState = value => {
        this.setState({
            isMenuOpen: value
        });
    };

    openMenu = () => {
        this.changeMenuState(true);
    };

    closeMenu = () => {
        this.changeMenuState(false);
    };

    render() {
        const { menu } = this;
        const { user, classes } = this.props;

        return (
            <div>
                <div className={classes.userChip}>
                    <UserInformation user={user} />
                    <button
                        className={classes.userMore}
                        onClick={this.openMenu}
                    >
                        <Icon name="chevron-up" />
                    </button>
                </div>
                {menu}
            </div>
        );
    }
}

export default classify(defaultClasses)(MyAccountMenuTrigger);
