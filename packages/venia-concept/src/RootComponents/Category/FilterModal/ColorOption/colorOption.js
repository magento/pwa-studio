import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './colorOption.css';

class ColorOption extends Component {
    static propTypes = {
        classes: PropTypes.shape({}),
        updateChosenItems: PropTypes.func
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const updatedChosenColors = nextProps.chosenOptions;
        return prevState.chosenColors !== updatedChosenColors
            ? { chosenColors: updatedChosenColors }
            : null;
    }

    state = {
        chosenColors: []
    };

    addColor = color => {
        const { updateChosenItems } = this.props;
        updateChosenItems(this.state.chosenColors.concat([color]));
    };

    removeColor = color => {
        const { updateChosenItems } = this.props;
        const { chosenColors } = this.state;
        const filteredColors = chosenColors.filter(
            currentColor => currentColor !== color
        );
        updateChosenItems(filteredColors);
    };

    toggleColor = color => {
        this.isColorChosen(color)
            ? this.removeColor(color)
            : this.addColor(color);
    };

    isColorChosen = color => this.state.chosenColors.indexOf(color) > -1;

    //TODO: set up some library to calculate contrast ratio between parent color
    // and probably colors from defined array of colors for check icon,
    // so that to choose color for check icon with best contrast ratio
    chooseCheckIconColor = parentColor =>
        parentColor !== 'white' ? 'white' : 'black';

    render() {
        const { classes, items } = this.props;

        return (
            <div className={classes.colorOptionContainer}>
                {items.map((color, index) => (
                    <button
                        key={index}
                        onClick={() => this.toggleColor(color)}
                        className={classes.colorOptionItem}
                        style={{ backgroundColor: color }}
                    >
                        {this.isColorChosen(color) ? (
                            <Icon
                                name="check"
                                attrs={{
                                    color: this.chooseCheckIconColor(color)
                                }}
                            />
                        ) : null}
                    </button>
                ))}
            </div>
        );
    }
}

export default classify(defaultClasses)(ColorOption);
