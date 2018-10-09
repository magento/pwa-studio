import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './option.css';
import swatchStyles from './swatch.css';
import tileStyles from './tile.css';
// import miniTileStyles from './miniTile.css';


class Option extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            children: PropTypes.string,
            childrenContainer: PropTypes.string
        }),
        item: PropTypes.shape({
            backgroundColor: PropTypes.string,
            name: PropTypes.string,
            value: PropTypes.string,
            isSelected: PropTypes.bool
        })
    };

    styleOptions = {
        Color: swatchStyles,
        Size: tileStyles
    }

    get check() {
      const { item } = this.props;
      const { isSelected  } = item;

      return isSelected ? (
        <Icon name="check" />
      ) : null
    }

    render() {
        const { item, children, optionType } = this.props;
        let { classes } = this.props;
        const { check } =  this;
        const { backgroundColor, value, isSelected, isDisabled } = item;
        const style = { '--background-color': backgroundColor };
        const additionalClasses = optionType ?  this.styleOptions[optionType] : classes;
        classes = Object.assign(classes, additionalClasses);

        let buttonClasses = isSelected ? `${classes.root} ${classes.selected}` : classes.root;
        buttonClasses = isDisabled ? `${buttonClasses} ${classes.disabled}` : buttonClasses;

        return (
            <button
                className={buttonClasses}
                data-title={value}
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
