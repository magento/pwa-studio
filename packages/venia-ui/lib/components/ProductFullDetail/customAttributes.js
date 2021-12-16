import React, { useMemo } from 'react';
import { array, shape, string } from 'prop-types';

import { useStyle } from '../../classify';

import defaultClasses from './customAttributes.module.css';
import { FormattedMessage } from 'react-intl';

// const getItemKey = ({ value_index }) => value_index;
//
// const getListComponent = (attribute_code, values) => {
//     const optionType = getOptionType({ attribute_code, values });
//
//     return optionType === 'swatch' ? SwatchList : TileList;
// };

const CustomAttributes = props => {
    const { customAttributes } = props;
    const classes = useStyle(defaultClasses, props.classes);

    if (customAttributes.length === 0) {
        return null;
    }

    // Remove attributes not visible on front
    const cleanAttributes = customAttributes
        .filter(
            ({ attribute_metadata }) =>
                attribute_metadata.is_visible_on_front === true
        )
        .sort(
            (a, b) =>
                a.attribute_metadata.sort_order -
                b.attribute_metadata.sort_order
        );

    if (cleanAttributes.length === 0) {
        return null;
    }

    const list = cleanAttributes.map(
        ({
            selected_attribute_options,
            entered_attribute_value,
            attribute_metadata
        }) => {
            const key = attribute_metadata.uid;
            const attributeLabel = attribute_metadata.label;
            let optionLabel;

            if (entered_attribute_value?.value) {
                optionLabel = entered_attribute_value.value;
            } else if (
                selected_attribute_options?.attribute_option.length > 0
            ) {
                optionLabel = selected_attribute_options.attribute_option
                    .map(option => {
                        return option.label;
                    })
                    .join(', ');
            }

            return (
                <li key={key} className={classes.listItem}>
                    <span className={classes.attributeLabel}>
                        {attributeLabel}
                    </span>
                    <span className={classes.optionLabel}>{optionLabel}</span>
                </li>
            );
        }
    );

    return (
        <div className={classes.root}>
            <p className={classes.title}>
                <FormattedMessage
                    id={'customAttributes.title'}
                    defaultMessage={'Details'}
                />
            </p>
            <ul className={classes.list}>{list}</ul>
        </div>
    );
};

CustomAttributes.propTypes = {
    classes: shape({
        root: string,
        title: string,
        list: string,
        listItem: string,
        attributeLabel: string,
        optionLabel: string
    }),
    customAttributes: array.isRequired
};

export default CustomAttributes;
