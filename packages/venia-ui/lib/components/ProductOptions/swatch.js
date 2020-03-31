import React, { useMemo } from 'react';
import { generateUrlFromContainerWidth, imageWidths } from '../../util/images';
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

import { useSwatch } from '@magento/peregrine/lib/talons/ProductOptions/useSwatch';

const getClassName = (name, isSelected, hasFocus) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}`;

const Swatch = props => {
    const {
        hasFocus,
        isSelected,
        item: { label, value_index, swatch_data },
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

    let swatchClass = 'root_color';
    let swatchValue = swatch_data ? swatch_data.value : '';

    if (swatch_data && swatchValue.charAt(0) !== '#') {
        const imagePath = generateUrlFromContainerWidth(
            swatchValue,
            imageWidths.get('ICON'),
            'image-swatch'
        );
        swatchClass = 'root_image';

        swatchValue = 'url("' + imagePath + '")';
    }

    // We really want to avoid specifying presentation within JS.
    // Swatches are unusual in that their color is data, not presentation,
    // but applying color *is* presentational.
    // So we merely provide the color data here, and let the CSS decide
    // how to use that color (e.g., background, border).
    const finalStyle = Object.assign({}, style, {
        '--venia-swatch-bg': swatchValue
    });

    const className = classes[getClassName(swatchClass, isSelected, hasFocus)];

    return (
        <button
            className={className}
            onClick={handleClick}
            style={finalStyle}
            title={label}
            type="button"
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
