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
            backgroundColor: string.isRequired,
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
        const { isSelected } = item;

        return isSelected ? <Icon name="check" /> : null;
    }

    render() {
        const { item, children, attributeCode } = this.props;
        let { classes } = this.props;
        const { check } = this;
        const {
            swatchColor,
            backgroundColor,
            label,
            isSelected,
            isDisabled
        } = item;
        //
        // TODO: When swatch_color is implemented in graphQL or if we add swatch_images,
        // rework the way backgroundColor is set in the parent component
        const style = !!swatchColor
            ? { '--background-color': `rgb(${swatchColor})` }
            : { '--background-color': backgroundColor };

        const additionalClasses = attributeCode
            ? this.styleOptions[attributeCode]
            : classes;
        classes = Object.assign(classes, additionalClasses);

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
                    <span className={classes.check}> {check} </span>
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
