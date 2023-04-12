import React from 'react';
import { bool, func, number, oneOfType, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { useStyle } from '../../classify';
import defaultClasses from './tile.module.css';
import { useTile } from '@magento/peregrine/lib/talons/ProductOptions/useTile';

const getClassName = (
    name,
    isSelected,
    hasFocus,
    isOptionOutOfStock,
    isEverythingOutOfStock
) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}${
        isEverythingOutOfStock || isOptionOutOfStock ? '_outOfStock' : ''
    }`;

const Tile = props => {
    const {
        hasFocus,
        isSelected,
        item: { label, value_index },
        onClick,
        isEverythingOutOfStock,
        isOptionOutOfStock
    } = props;

    const talonProps = useTile({
        onClick,
        value_index
    });

    const { handleClick } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);
    const className =
        classes[
            getClassName(
                'root',
                isSelected,
                hasFocus,
                isOptionOutOfStock,
                isEverythingOutOfStock
            )
        ];
    const { formatMessage } = useIntl();
    const ariaLabelView = formatMessage(
        {
            id: 'ProductOptions.productSize',
            defaultMessage: 'Fashion size {label}'
        },
        { label: label }
    );

    const ariaLabelSelected = formatMessage(
        {
            id: 'productOptions.selectedSize',
            defaultMessage: 'Fashion size {label} button Selected'
        },
        { label: label }
    );

    const result = isSelected ? ariaLabelSelected : ariaLabelView;

    return (
        <button
            className={className}
            onClick={handleClick}
            title={label}
            type="button"
            data-cy="Tile-button"
            aria-label={result}
            disabled={isEverythingOutOfStock || isOptionOutOfStock}
        >
            <span>{label}</span>
        </button>
    );
};

export default Tile;

Tile.propTypes = {
    hasFocus: bool,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: oneOfType([number, string]).isRequired
    }).isRequired,
    onClick: func.isRequired
};

Tile.defaultProps = {
    hasFocus: false,
    isSelected: false
};
