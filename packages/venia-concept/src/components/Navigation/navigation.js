import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import Login from 'src/components/Login';
import Tile from './tile';
import Trigger from './trigger';
import defaultClasses from './navigation.css';

import Button from 'src/components/Button';
// import IconButton from 'src/components/IconButton';
// import { login } from 'src/actions/user';
import { login } from 'src/actions/user';
import user from './user.svg';
import chevronUp from './chevronUp.svg';

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
            isLoginOpen: false
        }
    }

    get loginPrompt() {
        const { classes, firstname, lastname, email } = this.props;

        return !this.props.isLoggedIn ? (
            <Button onClick={this.showLoginForm}>
                Login
                </Button>) :
            <div className={classes.accountDrawer}>
                <img alt="user icon" src={user}/>
                <div>
                    <p> {firstname} {lastname}  </p>
                    <p>{email}</p>
                </div>
                <img alt="chevron up" src={chevronUp}/>
            </div>;
    }

     get loginErrorComponent() {
         const { loginError } = this.props.loginError;
         return !!this.state.loginError ? (
             <div>
                 <p> {loginError.message} </p>
                 <p>SDFSDFSDFSDFSDSDFSDFSDF</p>
             </div>
         ) : <p> hey </p>;
     }

     get loginForm() {
         const { classes, loginError } = this.props;
         const className = (!this.state.isLoginOpen || this.props.isLoggedIn) ? classes.loginClosed : classes.loginOpen;
         return  (
             <div className={`${className} ${classes.loginForm}`}>
                 <div className={classes.header}>
                     <h2 className={classes.title}>
                         <span>My Account</span>
                     </h2>
                     <div
                         onClick={this.hideLoginForm}>
                         <Icon name="x" />
                     </div>
                 </div>
                 <Login
                     onLogin={ this.onSubmitLogin }
                     loginError={loginError}
                 />
             </div>
         )
     }

    showLoginForm = () => {
        this.setState({
            isLoginOpen: true
        })
    }

    onSubmitLogin = (event) => {
        event.preventDefault();
        this.props.login('roni_cost@example.com', 'roni_cost3@example.com');
    }

    hideLoginForm = () => {
        this.setState({
            isLoginOpen: false
        })
    }
    get main() {
        const { classes, isOpen } = this.props;
        const className = isOpen ? classes.open : classes.closed;
        const { loginPrompt, loginForm } = this;

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
                <div className={classes.header}>
                    { loginPrompt }
                </div>
                {loginForm}
            </aside>
        );
    }

    login = (payload) => {
        this.props.login({payload});
    };


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
    login
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state['user']['isLoggedIn'],
        loginError: state['user']['loginError'],
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

