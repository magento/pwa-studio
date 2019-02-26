import React, { PureComponent } from 'react';
import { bool, func, object, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import CreateAccount from 'src/components/CreateAccount';
import SignIn from 'src/components/SignIn';
import ForgotPassword from 'src/components/ForgotPassword';
import CategoryTree from './categoryTree';
import NavHeader from './navHeader';
import defaultClasses from './navigation.css';
import { MyAccountMenuTrigger } from '../MyAccountMenuPage';

class Navigation extends PureComponent {
    static propTypes = {
        classes: shape({
            authBar: string,
            body: string,
            form_closed: string,
            form_open: string,
            footer: string,
            header: string,
            root: string,
            root_open: string,
            signIn_closed: string,
            signIn_open: string
        }),
        closeDrawer: func.isRequired,
        completePasswordReset: func.isRequired,
        createAccount: func.isRequired,
        email: string,
        firstname: string,
        forgotPassword: shape({
            email: string,
            isInProgress: bool
        }),
        getAllCategories: func.isRequired,
        getUserDetails: func.isRequired,
        isOpen: bool,
        isSignedIn: bool,
        lastname: string,
        resetPassword: func.isRequired,
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
        this.props.getUserDetails();
        this.props.getAllCategories();
    }

    state = {
        isCreateAccountOpen: false,
        isSignInOpen: false,
        isForgotPasswordOpen: false,
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
        const { classes } = this.props;

        return !this.props.isSignedIn ? (
            <div className={classes.authBar}>
                <Button priority="high" onClick={this.showSignInForm}>
                    Sign In
                </Button>
            </div>
        ) : (
            <MyAccountMenuTrigger />
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
                    onForgotPassword={this.setForgotPasswordForm}
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

    forgotPassword = () => {};

    /*
     * When the ForgotPassword component is mounted, its email input will be set to
     * the value of the SignIn component's email input.
     * Our common Input component handles initialValue only when component is mounted.
     */
    setForgotPasswordForm = () => {
        this.forgotPassword = className => {
            const {
                completePasswordReset,
                forgotPassword,
                resetPassword
            } = this.props;
            const { email, isInProgress } = forgotPassword;

            return (
                <div className={className}>
                    <ForgotPassword
                        completePasswordReset={completePasswordReset}
                        email={email}
                        initialValues={{ email: this.state.defaultUsername }}
                        isInProgress={isInProgress}
                        onClose={this.closeForgotPassword}
                        resetPassword={resetPassword}
                    />
                </div>
            );
        };
        this.showForgotPasswordForm();
    };

    closeForgotPassword = () => {
        this.props.closeDrawer();
        this.hideForgotPasswordForm();
        this.hideSignInForm();
    };

    get createAccountForm() {
        const { isCreateAccountOpen } = this.state;
        const { classes, isSignedIn } = this.props;
        const isOpen = !isSignedIn && isCreateAccountOpen;
        const className = isOpen ? classes.form_open : classes.form_closed;

        return this.createAccount(className);
    }

    get forgotPasswordForm() {
        const { isForgotPasswordOpen } = this.state;
        const { classes, isSignedIn } = this.props;
        const isOpen = !isSignedIn && isForgotPasswordOpen;
        const className = isOpen ? classes.form_open : classes.form_closed;

        return this.forgotPassword(className);
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

    showForgotPasswordForm = () => {
        this.setState(() => ({
            isForgotPasswordOpen: true
        }));
    };

    hideCreateAccountForm = () => {
        this.setState(() => ({
            isCreateAccountOpen: false
        }));
    };

    hideForgotPasswordForm = () => {
        this.setState(() => ({
            isForgotPasswordOpen: false
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
            forgotPasswordForm,
            hideForgotPasswordForm,
            props,
            state
        } = this;

        const {
            isCreateAccountOpen,
            isSignInOpen,
            isForgotPasswordOpen,
            rootNodeId
        } = state;
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
                : isForgotPasswordOpen
                ? hideForgotPasswordForm
                : isSignInOpen && !isSignedIn
                ? hideSignInForm
                : isTopLevel
                ? closeDrawer
                : setRootNodeIdToParent;

        const title =
            isCreateAccountOpen && !isSignedIn
                ? 'Create Account'
                : isForgotPasswordOpen
                ? 'Forgot password'
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
                {forgotPasswordForm}
            </aside>
        );
    }
}

export default classify(defaultClasses)(Navigation);
