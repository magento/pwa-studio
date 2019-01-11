import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import ShoppingCartIcon from 'react-feather/dist/icons/shopping-cart';
import Share2Icon from 'react-feather/dist/icons/share-2';
import MessageSquareIcon from 'react-feather/dist/icons/message-square';
import defaultClasses from './buttonGroup.css';

const ButtonGroupIcons = {
    ShoppingCart: ShoppingCartIcon,
    Share2: Share2Icon,
    MessageSquare: MessageSquareIcon
};

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
                    <Icon src={ButtonGroupIcons[iconName]} />
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
