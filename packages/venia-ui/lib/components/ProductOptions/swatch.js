import React, { useMemo } from 'react';
import {
    bool,
    func,
    number,
    object,
    oneOfType,
    shape,
    string
} from 'prop-types';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import { Check as CheckIcon } from 'react-feather';

import defaultClasses from './swatch.css';

import { memoizedGetRandomColor } from '../../util/getRandomColor';
import { useSwatch } from '@magento/peregrine/lib/talons/ProductOptions/useSwatch';

const getClassName = (name, isSelected, hasFocus) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}`;

const Swatch = props => {
    const {
        hasFocus,
        isSelected,
        item: { label, value_index },
        onClick,
        style
    } = props;

    const talonProps = useSwatch({
        onClick,
        value_index
    });

    const { handleClick } = talonProps;

    const icon = useMemo(() => {
        return isSelected ? <Icon src={CheckIcon} /> : null;
    }, [isSelected]);

    const classes = mergeClasses(defaultClasses, props.classes);

    // TODO: use the colors from graphQL when they become available.
    //   https://github.com/magento/graphql-ce/issues/196
    //   https://github.com/magento/pwa-studio/issues/1633
    const randomColor = memoizedGetRandomColor(value_index);

    // We really want to avoid specifying presentation within JS.
    // Swatches are unusual in that their color is data, not presentation,
    // but applying color *is* presentational.
    // So we merely provide the color data here, and let the CSS decide
    // how to use that color (e.g., background, border).
    const finalStyle = Object.assign({}, style, {
        '--venia-swatch-bg': randomColor
    });

    const className = classes[getClassName('root', isSelected, hasFocus)];

    return (
        <button
            onClick={handleClick}
            title={label}
            className={className}
            style={finalStyle}
        >
            {icon}
        </button>
    );
};

Swatch.propTypes = {
    hasFocus: bool,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: oneOfType([number, string]).isRequired
    }).isRequired,
    onClick: func.isRequired,
    style: object
};

Swatch.defaultProps = {
    hasFocus: false,
    isSelected: false
};

export default Swatch;
