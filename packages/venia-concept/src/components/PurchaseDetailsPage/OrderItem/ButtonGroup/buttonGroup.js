import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import defaultClasses from './buttonGroup.css';

class ButtonGroup extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            buttonGroupItem: PropTypes.string,
            buttonContent: PropTypes.string,
            iconContainer: PropTypes.string,
            textNodeContiner: PropTypes.string
        }),
        buttonGroupItems: PropTypes.arrayOf(
            PropTypes.shape({
                onClickHandler: PropTypes.func,
                iconName: PropTypes.string,
                textNode: PropTypes.node
            })
        )
    };

    getButtonGroupItem({ onClickHandler, iconName, textNode }) {
        const { classes } = this.props;
        return (
            <Button
                key={textNode}
                classes={{
                    root: classes.buttonGroupItem,
                    content: classes.buttonContent
                }}
                onClick={onClickHandler}
            >
                <span className={classes.iconContainer}>
                    <Icon name={iconName} />
                </span>
                <span className={classes.textNodeContiner}>{textNode}</span>
            </Button>
        );
    }

    render() {
        const { classes, buttonGroupItems } = this.props;

        return (
            <div className={classes.root}>
                {buttonGroupItems.map(item => {
                    return this.getButtonGroupItem(item);
                })}
            </div>
        );
    }
}

export default classify(defaultClasses)(ButtonGroup);
