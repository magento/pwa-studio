import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import SwatchTooltip from 'src/components/SwatchTooltip';
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
        classes: PropTypes.shape({
            root: PropTypes.string,
            tooltip: PropTypes.string
        }),
        hasFocus: PropTypes.bool,
        isSelected: PropTypes.bool,
        item: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            label: PropTypes.string
        }),
        itemIndex: PropTypes.number
    };

    get icon() {
        const { isSelected } = this.props;

        return isSelected ? <Icon name="check" /> : null;
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
        {
            /* TODO: currently backend doesn't provide graphql schemas for colors,
            so in future when they will be available(if any)
            it's need to use actual color name here instead of 'Color'
        */
        }
        return (
            <SwatchTooltip tooltipText="Color">
                <button
                    {...restProps}
                    className={className}
                    style={finalStyle}
                    title={label}
                >
                    {icon}
                </button>
            </SwatchTooltip>
        );
    }
}

export default classify(defaultClasses)(Swatch);
