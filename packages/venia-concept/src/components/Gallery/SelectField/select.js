import React, { Fragment } from 'react';
import { arrayOf, node, number, oneOfType, shape, string } from 'prop-types';
import { Option as InformedOption, Select as InformedSelect, useFieldState } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { FieldIcons } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from '@magento/venia-ui/lib/components/Select/select.module.css';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { ChevronDown as ChevronDownIcon } from 'react-feather';

const arrow = <Icon src={ChevronDownIcon} size={24} />;

const Select = props => {
    const { before, classes: propClasses, field, items, message, ...rest } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = classes.input;
    const options = items.map(item => (
        <InformedOption key={item.value + item?.product?.sku} value={JSON.stringify(item)}>
            {item.label || (item.value != null ? item.value : '')}
        </InformedOption>
    ));

    return (
        <Fragment>
            <FieldIcons after={arrow} before={before}>
                <InformedSelect {...rest} className={inputClass} field={field}>
                    {options}
                </InformedSelect>
            </FieldIcons>
        </Fragment>
    );
};

export default Select;

Select.propTypes = {
    before: node,
    classes: shape({
        input: string
    }),
    field: string.isRequired,
    items: arrayOf(
        shape({
            key: oneOfType([number, string]),
            label: string,
            value: oneOfType([number, string])
        })
    ),
    message: node
};
