import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import classify from 'src/classify';
import SignIn from 'src/components/SignIn';
import CreateAccount from 'src/components/CreateAccount';
import Tile from './tile';
import defaultClasses from './navigation.css';
import NavHeader from './navHeader';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';

const CATEGORIES = [
    'dresses',
    'tops',
    'bottoms',
    'skirts',
    'swim',
    'outerwear',
    'shoes',
    'jewelry',
    'accessories'
];

const tiles = CATEGORIES.map(category => (
    <Tile key={category} text={category} />
));

class Navigation extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            accountDrawer: PropTypes.string,
            userInfo: PropTypes.string,
            signInClosed: PropTypes.string,
            signInOpen: PropTypes.string,
            header: PropTypes.string,
            title: PropTypes.string,
            tiles: PropTypes.string,
            open: PropTypes.string,
            closed: PropTypes.string,
            bottomDrawer: PropTypes.string
        }),
        isOpen: PropTypes.bool,
        isSignedIn: PropTypes.bool,
        signInError: PropTypes.object,
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        email: PropTypes.string
    };

    state = {
        isSignInOpen: false
    };

    get bottomDrawer() {
        const { classes, firstname, lastname, email } = this.props;

        return !this.props.isSignedIn ? (
            <Button onClick={this.showSignInForm}>Sign In</Button>
        ) : (
            <div className={classes.accountDrawer}>
                <Icon name="user" />
                <div className={classes.userInfo}>
                    <p>
                        {firstname} {lastname}
                    </p>
                    <p>{email}</p>
                </div>
                <button>
                    <Icon name="chevron-up" />
                </button>
            </div>
        );
    }

    get signInForm() {
        const { classes } = this.props;
        const className =
            !this.state.isSignInOpen || this.props.isSignedIn
                ? classes.signInClosed
                : classes.signInOpen;
        return (
            <div className={`${className} ${classes.signInForm}`}>
                <NavHeader onBack={this.hideSignInForm} title={'My Account'} />
                <SignIn showCreateAccountForm={this.setCreateAccountForm} setDefaultUsername={this.setDefaultUsername}/>
            </div>
        );
    }

    createAccount = () => { }

    setCreateAccountForm = () => {
        /*
        When the CreateAccount component mounts, its email input will be set to
        the value of the SignIn component's email input.
        Inform's initialValue is set on component mount.
        Once the create account button is dirtied, always render the CreateAccount
        Component to show animation.
        */
        this.createAccount = (className, classes) => {
            return (<div className={`${className} ${classes.signInForm}`}>
                <NavHeader
                    onBack={this.hideCreateAccountForm}
                    title={'Create Account'}
                />
                <CreateAccount defaultUsername={this.state.defaultUsername} />
            </div>
            )
        }
        this.showCreateAccountForm();
    }

    get createAccountForm() {
        const { classes } = this.props;
        const className =
            !this.state.isCreateAccountOpen || this.props.isSignedIn
            ? classes.createAccountClosed
            : classes.createAccountOpen;

        return this.createAccount(className, classes);
    }

    showSignInForm = () => {
        this.setState({
            isSignInOpen: true
        });
    };

    hideSignInForm = () => {
        this.setState({
            isSignInOpen: false
        });
    };

    setDefaultUsername = newDefaultUsername => {
        this.setState({defaultUsername: newDefaultUsername})
    }

    showCreateAccountForm = () => {
        this.setState({
            isCreateAccountOpen: true
        });
    };

    hideCreateAccountForm = () => {
        this.setState({
            isCreateAccountOpen: false
        });
    };

    render() {
        const { classes, isOpen } = this.props;
        const className = isOpen ? classes.open : classes.closed;
        const { bottomDrawer, signInForm, createAccountForm } = this;

        return (
            <aside className={className}>
                <NavHeader title={'Main Menu'} />
                <nav className={classes.tiles}>{tiles}</nav>
                <div className={classes.bottomDrawer}>{bottomDrawer}</div>
                {signInForm}
                {createAccountForm}
            </aside>
        );
    }
}

const mapStateToProps = state => {
    return {
        isSignedIn: state.user.isSignedIn,
        firstname: state.user.firstname,
        lastname: state.user.lastname,
        email: state.user.email
    };
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        null
    )
)(Navigation);
