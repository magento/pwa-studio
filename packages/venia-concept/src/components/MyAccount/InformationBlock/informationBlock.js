import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
import classify from 'src/classify';
import ActionButton from '../ActionButton';
import Separator from './Separator';
import defaultClasses from './informationBlock.css';

class InformationBlock extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            actions: PropTypes.string
        }),
        title: PropTypes.node,
        actions: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                onClick: PropTypes.func
            })
        )
    };

    render() {
        const { classes, actions, title, children } = this.props;

        return (
            <div className={classes.root}>
                {title}
                {children}
                <List
                    items={actions}
                    getItemKey={({ title }) => title}
                    render={({ children }) => (
                        <div className={classes.actions}>{children}</div>
                    )}
                    renderItem={({ item: { title, onClick }, item }) => (
                        <Fragment>
                            <ActionButton onClick={onClick}>
                                {title}
                            </ActionButton>
                            <Separator
                                isHidden={item === actions[actions.length - 1]}
                            />
                        </Fragment>
                    )}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(InformationBlock);
