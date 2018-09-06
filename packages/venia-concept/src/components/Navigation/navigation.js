import React, { PureComponent } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import Trigger from 'src/components/Trigger';
import Tree from './categoryTree';
import defaultClasses from './navigation.css';

class Navigation extends PureComponent {
    static propTypes = {
        classes: shape({
            body: string,
            header: string,
            root: string,
            root_open: string,
            title: string,
            trigger: string
        }),
        closeDrawer: func.isRequired,
        getAllCategories: func.isRequired,
        isOpen: bool
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

    async componentDidMount() {
        this.props.getAllCategories();
    }

    state = {
        rootNodeId: null
    };

    get headerItems() {
        const { rootNodeId } = this.state;
        const { classes, closeDrawer, rootCategoryId } = this.props;
        const isTopLevel = !rootNodeId || rootNodeId === rootCategoryId;

        const title = isTopLevel && (
            <h2 key="title" className={classes.title}>
                <span>Main Menu</span>
            </h2>
        );

        const backButton = isTopLevel ? null : (
            <Trigger
                key="backButton"
                className={classes.backButton}
                action={this.goUpOneLevel}
            >
                <Icon name="arrow-left" />
            </Trigger>
        );

        const closeButton = (
            <Trigger
                key="closeButton"
                className={classes.closeButton}
                action={closeDrawer}
            >
                <Icon name="x" />
            </Trigger>
        );

        return [backButton, title, closeButton];
    }

    get categoryTree() {
        const { rootNodeId } = this.state;
        const { categories, closeDrawer } = this.props;

        if (!rootNodeId) {
            return null;
        }

        return (
            <Tree
                nodes={categories}
                rootNodeId={rootNodeId}
                onNavigate={closeDrawer}
                updateRootNodeId={this.setRootNodeId}
            />
        );
    }

    goUpOneLevel = () => {
        const { categories } = this.props;

        this.setState(({ rootNodeId }) => ({
            rootNodeId: categories[rootNodeId].parentId
        }));
    };

    setRootNodeId = rootNodeId => {
        this.setState(() => ({ rootNodeId }));
    };

    render() {
        const { categoryTree, headerItems, props } = this;
        const { classes, isOpen } = props;
        const className = isOpen ? classes.root_open : classes.root;

        return (
            <aside className={className}>
                <div className={classes.header}>{headerItems}</div>
                <div className={classes.body}>{categoryTree}</div>
            </aside>
        );
    }
}

export default classify(defaultClasses)(Navigation);
