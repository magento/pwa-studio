import React, { Component } from 'react';
import { bool, number, object, oneOfType, shape, string } from 'prop-types';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import CheckIcon from 'react-feather/dist/icons/check';
import defaultClasses from './swatch.css';

import { memoizedGetRandomColor } from 'src/util/getRandomColor';

const getClassName = (name, isSelected, hasFocus) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}`;

class Swatch extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        hasFocus: bool,
        isSelected: bool,
        item: shape({
            label: string.isRequired,
            value_index: oneOfType([number, string]).isRequired
        }).isRequired,
        itemIndex: number,
        style: object
    };

    static defaultProps = {
        hasFocus: false,
        isSelected: false
    };

    get icon() {
        const { isSelected } = this.props;

        return isSelected ? <Icon src={CheckIcon} /> : null;
    }

    render() {
        const { icon, props } = this;
        const {
            classes,
            hasFocus,
            isSelected,
            item,
            // eslint-disable-next-line
            itemIndex,
            style,
            ...restProps
        } = props;
        const className = classes[getClassName('root', isSelected, hasFocus)];
        const { label, value_index } = item;

        // We really want to avoid specifying presentation within JS.
        // Swatches are unusual in that their color is data, not presentation,
        // but applying color *is* presentational.
        // So we merely provide the color data here, and let the CSS decide
        // how to use that color (e.g., background, border).
        const finalStyle = Object.assign({}, style, {
            '--venia-swatch-bg': memoizedGetRandomColor(value_index)
        });

        return (
            <button
                {...restProps}
                className={className}
                style={finalStyle}
                title={label}
            >
                {icon}
            </button>
        );
    }
}

export default classify(defaultClasses)(Swatch);
