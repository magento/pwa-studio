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
import { logInUser } from 'src/actions/login';

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
        return !this.props.isLoggedIn ? (
        <Button onClick={this.showLoginForm}>
            Login
        </Button>) : <p> Logged in! </p>;
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
         const { classes, isOpen, loginError } = this.props;
         const className = isOpen ? classes.open : classes.closed;
         return !!this.state.isLoginOpen ? (
             <aside className={className}>
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
             </aside>
         ) : null;
     }

    showLoginForm = () => {
        this.setState({
            isLoginOpen: true
        })
    }

    onSubmitLogin = (event) => {
        event.preventDefault();
        this.props.logInUser('roni_cost@example.com', 'roni_cost3@example.com');
    }

    hideLoginForm = () => {
        this.setState({
            isLoginOpen: false
        })
    }
    get main() {
        const { classes, isOpen } = this.props;
        const className = isOpen ? classes.open : classes.closed;
        const { loginPrompt } = this;

        return !this.state.isLoginOpen ? (
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
            </aside>
        ) : null;
    }

    logInUser = (payload) => {
        this.props.logInUser({payload});
    };


    render() {
        const {
            main,
            loginForm
        } = this;

        return (
            <div>
                {main}
                {loginForm}
            </div>
        );
    }
}

const mapDispatchToProps = {
    logInUser
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state['app']['isLoggedIn'],
        loginError: state['app']['loginError']
    }
}

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Navigation);

