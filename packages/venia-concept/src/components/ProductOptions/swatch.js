import React, { Component } from 'react';
import { bool, number, oneOfType, shape, string } from 'prop-types';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import defaultClasses from './swatch.css';

// TODO: replace with actual swatch colors or images from API
// M2 GraphQL doesn't currently support them
const cache = new Map();
const memoize = fn => key =>
    cache.has(key) ? cache.get(key) : cache.set(key, fn(key)).get(key);

const getRandomColor = () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 255)).join(',');
const memoizedGetRandomColor = memoize(getRandomColor);

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
        })
    };

    get icon() {
        const { isSelected } = this.props;

        return isSelected ? <Icon name="check" /> : null;
    }

    render() {
        const { icon, props } = this;
        const {
            classes,
            hasFocus, // eslint-disable-line
            isSelected,
            item,
            style,
            ...restProps
        } = props;
        const className = isSelected ? classes.root_selected : classes.root;
        const { label, value_index } = item;

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
