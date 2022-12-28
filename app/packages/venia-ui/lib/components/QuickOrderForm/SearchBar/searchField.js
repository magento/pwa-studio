import React from 'react';
import { func } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './searchField.module.css';
import { useIntl } from 'react-intl';

const SearchField = props => {
    const classes = useStyle(defaultClasses);
    const { onChange, quickOrder, value, ...rest } = props;
    const { formatMessage } = useIntl();

    return (
        <div className={defaultClasses.searchField}>
            <input
                onChange={e => onChange(e.target.value)}
                placeholder={formatMessage({
                    id: 'quickOrder.SearchProduct',
                    defaultMessage: 'Enter SKU or name of product'
                })}
                value={value}
                {...rest}
                className={`${classes.input} ${quickOrder && defaultClasses.inputQty}`}
            />
        </div>
    );
};

export default SearchField;

SearchField.propTypes = {
    onChange: func,
    onFocus: func
};
