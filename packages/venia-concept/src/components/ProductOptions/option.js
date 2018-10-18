import React, { Component } from 'react';
import { string, bool, func, number, shape } from 'prop-types';
import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './option.css';
import swatchStyles from './swatch.css';
import tileStyles from './tile.css';
import miniTileStyles from './miniTile.css';

class Option extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            children: string,
            childrenContainer: string
        }),
        item: shape({
            backgroundColor: string,
            isSelected: bool,
            attributeCode: string.isRequired,
            isDisabled: bool,
            label: string.isRequired,
            onclick: func,
            value_index: number.isRequired
        })
    };

    styleOptions = {
        color: swatchStyles,
        size: tileStyles,
        sleeve: miniTileStyles
    };

    get check() {
        const { item } = this.props;
        const { isSelected, backgroundColor, attributeCode } = item;

        if (attributeCode === 'color') {
            let checkmarkColor = 'check--light';
            if (backgroundColor) {
                checkmarkColor = this.isLight(backgroundColor)
                    ? 'check--dark'
                    : 'check--light';
            }
            const classes = this.mergedClasses(attributeCode);

            return isSelected ? (
                <span className={`${classes.check} ${classes[checkmarkColor]}`}>
                    <Icon name="check" />
                </span>
            ) : null;
        } else {
            return null;
        }
    }

    isLight = color => {
        color = color.replace('#', '');
        let sum = parseInt(color[0] + color[1], 16);
        sum += parseInt(color[2] + color[3], 16);
        sum += parseInt(color[4] + color[5], 16);
        return sum > 382.6;
    };

    mergedClasses = attributeCode => {
        let { classes } = this.props;
        const additionalClasses = attributeCode
            ? this.styleOptions[attributeCode]
            : classes;
        classes = Object.assign(classes, additionalClasses);

        return classes;
    };

    render() {
        const { item, children } = this.props;
        const { attributeCode } = item;
        const { check, mergedClasses } = this;
        const classes = mergedClasses(attributeCode);
        const { backgroundColor, label, isSelected, isDisabled } = item;

        // TODO: When swatch_color is implemented in graphQL or if we add swatch_images,
        // rework the way backgroundColor is set in the parent component
        const style = { '--background-color': `${backgroundColor}` };

        let buttonClasses = isSelected
            ? `${classes.root} ${classes.selected}`
            : classes.root;

        buttonClasses = isDisabled
            ? `${buttonClasses} ${classes.disabled}`
            : buttonClasses;

        return (
            <button
                className={buttonClasses}
                data-title={label}
                style={style}
                onClick={this.handleClick}
            >
                <span className={classes.childrenContainer}>
                    <span className={classes.children}> {children} </span>
                    {check}
                </span>
                <div className={classes.overlay} />
            </button>
        );
    }

    handleClick = () => {
        this.props.handleClick(this.props.item);
    };
}

export default classify(defaultClasses)(Option);
