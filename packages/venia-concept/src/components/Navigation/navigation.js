import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import SignIn from 'src/components/SignIn';
import Tile from './tile';
import Trigger from './trigger';
import defaultClasses from './navigation.css';

import Button from 'src/components/Button';
import { signIn } from 'src/actions/user';

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
            root: PropTypes.string
        }),
        isOpen: PropTypes.bool
    };

    constructor() {
        super()
        this.state = {
            isSignInOpen: false
        }
    }

    get bottomDrawer() {
        const { classes, firstname, lastname, email } = this.props;

        return !this.props.isSignedIn ? (
            <Button onClick={this.showSignInForm}>
                Sign In
            </Button>) :
            <div className={classes.accountDrawer}>
                <Icon name="user" />
                <div>
                    <p> {firstname} {lastname}  </p>
                    <p>{email}</p>
                </div>
                <button>
                    <Icon name="chevron-up" />
                </button>
            </div>;
    }

     get signInForm() {
         const { classes, signInError, signIn } = this.props;
         const className = (!this.state.isSignInOpen || this.props.isSignedIn) ? classes.signInClosed : classes.signInOpen;
         return  (
             <div className={`${className} ${classes.signInForm}`}>
                 <div className={classes.header}>
                     <h2 className={classes.title}>
                         <span>My Account</span>
                     </h2>
                     <button
                         onClick={this.hideSignInForm}>
                         <Icon name="x" />
                     </button>
                 </div>
                 <SignIn
                     signIn={ signIn }
                     signInError={signInError}
                 />
             </div>
         )
     }

    showSignInForm = () => {
        this.setState({
            isSignInOpen: true
        })
    }

    hideSignInForm = () => {
        this.setState({
            isSignInOpen: false
        })
    }
    get main() {
        const { classes, isOpen } = this.props;
        const className = isOpen ? classes.open : classes.closed;
        const { bottomDrawer, signInForm } = this;

        return (
            <aside className={className}>
                <div className={classes.header}>
                    <h2 className={classes.title}>
                        <span>Main Menu</span>
                    </h2>
                    <Trigger>
                        <Icon name="x" />
                    </Trigger>
                </div>
                <nav className={classes.tiles}>{tiles}</nav>
                <div className={classes.bottomDrawer}>
                    { bottomDrawer }
                </div>
                {signInForm}
            </aside>
        );
    }

    render() {
        const {
            main
        } = this;

        return (
            <div>
                {main}
            </div>
        );
    }
}

const mapDispatchToProps = {
    signIn
}

const mapStateToProps = state => {
    return {
        isSignedIn: state['user']['isSignedIn'],
        signInError: state['user']['signInError'],
        firstname: state['user']['firstname'],
        lastname: state['user']['lastname'],
        email: state['user']['email']
    }
}

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Navigation);

