import React, { Component } from 'react';
import { bool, number, oneOfType, shape, string } from 'prop-types';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import CheckIcon from 'react-feather/dist/icons/check';
import defaultClasses from './swatch.css';

// TODO: replace with actual swatch colors or images from API
// M2 GraphQL doesn't currently support them
const cache = new Map();
const memoize = fn => key =>
    cache.has(key) ? cache.get(key) : cache.set(key, fn(key)).get(key);

const getRandomColor = () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 255)).join(',');
const memoizedGetRandomColor = memoize(getRandomColor);

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
            id: oneOfType([number, string]),
            label: string
        }),
        itemIndex: number
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
