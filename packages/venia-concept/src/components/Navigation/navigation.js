import React, { PureComponent } from 'react';
import { bool, func, object, shape, string } from 'prop-types';

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
            authBar: string,
            body: string,
            createAccount_closed: string,
            createAccount_open: string,
            footer: string,
            header: string,
            open: string,
            root: string,
            root_open: string,
            signIn_closed: string,
            signIn_open: string,
            title: string,
            userAvatar: string,
            userChip: string,
            userEmail: string,
            userInfo: string,
            userMore: string,
            userName: string
        }),
        firstname: string,
        getAllCategories: func.isRequired,
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
        isCreateAccountOpen: false,
        isSignInOpen: false,
        rootNodeId: null,
        currentPath: null
    };

    get categoryTree() {
        const { props, setCurrentPath, state } = this;
        const { rootNodeId } = state;
        const { closeDrawer } = props;

        return rootNodeId ? (
            <CategoryTree
                rootNodeId={props.rootCategoryId}
                currentId={rootNodeId}
                updateRootNodeId={setCurrentPath}
                onNavigate={closeDrawer}
            />
        ) : null;
    }

    get footer() {
        const { classes, firstname, lastname, email } = this.props;

        return !this.props.isSignedIn ? (
            <div className={classes.authBar}>
                <Button onClick={this.showSignInForm}>Sign In</Button>
            </div>
        ) : (
            <div className={classes.userChip}>
                <div className={classes.userAvatar}>
                    <Icon name="user" />
                </div>
                <div className={classes.userInfo}>
                    <p className={classes.userName}>
                        {`${firstname} ${lastname}`}
                    </p>
                    <p className={classes.userEmail}>{email}</p>
                </div>
                <button className={classes.userMore}>
                    <Icon name="chevron-up" />
                </button>
            </div>
        );
    }

    get signInForm() {
        const { isSignInOpen } = this.state;
        const { classes, isSignedIn } = this.props;
        const isOpen = !isSignedIn && isSignInOpen;
        const className = isOpen ? classes.signIn_open : classes.signIn_closed;

        return (
            <div className={className}>
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
        this.createAccount = className => {
            return (
                <div className={className}>
                    <CreateAccount
                        onSubmit={this.props.createAccount}
                        initialValues={{ email: this.state.defaultUsername }}
                    />
                </div>
            );
        };
        this.showCreateAccountForm();
    };

    get createAccountForm() {
        const { isCreateAccountOpen } = this.state;
        const { classes, isSignedIn } = this.props;
        const isOpen = !isSignedIn && isCreateAccountOpen;
        const className = isOpen
            ? classes.createAccount_open
            : classes.createAccount_closed;

        return this.createAccount(className);
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

    setCurrentPath = currentPath => {
        const path = currentPath.split('/').reverse();
        const rootNodeId = parseInt(path[0]);

        this.setState(() => ({
            rootNodeId: rootNodeId,
            currentPath: path
        }));
    };

    setRootNodeIdToParent = () => {
        const path = this.state.currentPath;
        const parentId =
            path.length > 1 ? parseInt(path[1]) : this.props.rootCategoryId;
        path.shift();

        this.setState(() => ({
            rootNodeId: parentId,
            currentPath: path
        }));
    };

    render() {
        const {
            categoryTree,
            createAccountForm,
            footer,
            hideCreateAccountForm,
            hideSignInForm,
            setRootNodeIdToParent,
            signInForm,
            props,
            state
        } = this;

        const { isCreateAccountOpen, isSignInOpen, rootNodeId } = state;
        const {
            classes,
            closeDrawer,
            isOpen,
            isSignedIn,
            rootCategoryId
        } = props;
        const className = isOpen ? classes.root_open : classes.root;
        const isTopLevel = !rootNodeId || rootNodeId === rootCategoryId;

        const handleBack =
            isCreateAccountOpen && !isSignedIn
                ? hideCreateAccountForm
                : isSignInOpen && !isSignedIn
                ? hideSignInForm
                : isTopLevel
                ? closeDrawer
                : setRootNodeIdToParent;

        const title =
            isCreateAccountOpen && !isSignedIn
                ? 'Create Account'
                : isSignInOpen && !isSignedIn
                ? 'Sign In'
                : 'Main Menu';

        return (
            <aside className={className}>
                <div className={classes.header}>
                    <NavHeader
                        title={title}
                        onBack={handleBack}
                        onClose={closeDrawer}
                    />
                </div>
                <nav className={classes.body}>{categoryTree}</nav>
                <div className={classes.footer}>{footer}</div>
                {signInForm}
                {createAccountForm}
            </aside>
        );
    }
}

export default classify(defaultClasses)(Navigation);
