import React, { PureComponent } from 'react';
import { bool, object, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import CreateAccount from 'src/components/CreateAccount';
import Icon from 'src/components/Icon';
import SignIn from 'src/components/SignIn';
import CategoryTree from './categoryTree';
import NavHeader from './navHeader';
import defaultClasses from './navigation.css';

class Navigation extends PureComponent {
    static propTypes = {
        classes: shape({
            accountDrawer: string,
            body: string,
            bottomDrawer: string,
            header: string,
            open: string,
            root: string,
            root_open: string,
            signInClosed: string,
            signInOpen: string,
            title: string,
            userInfo: string
        }),
        firstname: string,
        email: string,
        isOpen: bool,
        isSignedIn: bool,
        lastname: string,
        signInError: object
    };

    static getDerivedStateFromProps(props, state) {
        if (!state.rootNodeId && props.rootCategoryId) {
            return {
                ...state,
                rootNodeId: props.rootCategoryId
            };
        }

        return state;
    }

    componentDidMount() {
        this.props.getAllCategories();
    }

    state = {
        isSignInOpen: false,
        rootNodeId: null
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
                <button className="">
                    <Icon name="chevron-up" />
                </button>
            </div>
        );
    }

    get categoryTree() {
        const { props, setRootNodeId, state } = this;
        const { rootNodeId } = state;
        const { categories, closeDrawer } = props;

        return rootNodeId ? (
            <CategoryTree
                nodes={categories}
                rootNodeId={rootNodeId}
                onNavigate={closeDrawer}
                updateRootNodeId={setRootNodeId}
            />
        ) : null;
    }

    get signInForm() {
        const { classes, closeDrawer } = this.props;
        const className =
            !this.state.isSignInOpen || this.props.isSignedIn
                ? classes.signInClosed
                : classes.signInOpen;
        return (
            <div className={`${className} ${classes.signInForm}`}>
                <NavHeader
                    title="My Account"
                    onBack={this.hideSignInForm}
                    onClose={closeDrawer}
                />
                <SignIn
                    showCreateAccountForm={this.setCreateAccountForm}
                    setDefaultUsername={this.setDefaultUsername}
                />
            </div>
        );
    }

    createAccount = () => {};

    setCreateAccountForm = () => {
        /*
        When the CreateAccount component mounts, its email input will be set to
        the value of the SignIn component's email input.
        Inform's initialValue is set on component mount.
        Once the create account button is dirtied, always render the CreateAccount
        Component to show animation.
        */
        this.createAccount = (className, classes) => {
            return (
                <div className={`${className} ${classes.signInForm}`}>
                    <NavHeader
                        onBack={this.hideCreateAccountForm}
                        title={'Create Account'}
                    />
                    <CreateAccount
                        defaultUsername={this.state.defaultUsername}
                    />
                </div>
            );
        };
        this.showCreateAccountForm();
    };

    get createAccountForm() {
        const { classes } = this.props;
        const className =
            !this.state.isCreateAccountOpen || this.props.isSignedIn
                ? classes.createAccountClosed
                : classes.createAccountOpen;

        return this.createAccount(className, classes);
    }

    showSignInForm = () => {
        this.setState(() => ({
            isSignInOpen: true
        }));
    };

    hideSignInForm = () => {
        this.setState(() => ({
            isSignInOpen: false
        }));
    };

    setDefaultUsername = nextDefaultUsername => {
        this.setState(() => ({ defaultUsername: nextDefaultUsername }));
    };

    showCreateAccountForm = () => {
        this.setState(() => ({
            isCreateAccountOpen: true
        }));
    };

    hideCreateAccountForm = () => {
        this.setState(() => ({
            isCreateAccountOpen: false
        }));
    };

    setRootNodeId = rootNodeId => {
        this.setState(() => ({ rootNodeId }));
    };

    setRootNodeIdToParent = () => {
        const { categories } = this.props;

        this.setState(({ rootNodeId }) => ({
            rootNodeId: categories[rootNodeId].parentId
        }));
    };

    render() {
        const {
            bottomDrawer,
            categoryTree,
            createAccountForm,
            setRootNodeIdToParent,
            signInForm,
            props,
            state
        } = this;

        const { rootNodeId } = state;
        const { classes, closeDrawer, isOpen, rootCategoryId } = props;
        const className = isOpen ? classes.root_open : classes.root;
        const isTopLevel = !rootNodeId || rootNodeId === rootCategoryId;
        const title = isTopLevel ? 'Main Menu' : null;

        return (
            <aside className={className}>
                <div className={classes.header}>
                    <NavHeader
                        title={title}
                        onBack={setRootNodeIdToParent}
                        onClose={closeDrawer}
                    />
                </div>
                <nav className={classes.body}>{categoryTree}</nav>
                <div className={classes.bottomDrawer}>{bottomDrawer}</div>
                {signInForm}
                {createAccountForm}
            </aside>
        );
    }
}

export default classify(defaultClasses)(Navigation);
