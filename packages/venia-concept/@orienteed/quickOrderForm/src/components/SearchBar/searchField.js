import React from 'react';
import { func } from 'prop-types';
import { Search as SearchIcon, X as ClearIcon } from 'react-feather';
import { useSearchField } from '@magento/peregrine/lib/talons/SearchBar';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './searchField.module.css';
import { FormattedMessage, useIntl } from 'react-intl';

const clearIcon = <Icon src={ClearIcon} size={24} />;
const searchIcon = <Icon src={SearchIcon} size={24} />;

const SearchField = props => {
    const classes = useStyle(defaultClasses);
    const {
        isSearchOpen,
        onChange,
        quickOrder,
        onFocus,
        placeholder,
        value,
        ...rest
    } = props;
    const { formatMessage } = useIntl();
    // const { inputRef, resetForm } = useSearchField({ isSearchOpen });

    // const resetButton = value ? <Trigger action={resetForm}>{clearIcon}</Trigger> : null;

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
                className={`${classes.input} ${quickOrder &&
                    defaultClasses.inputQty}`}
            />
        </div>
    );
};

export default SearchField;

SearchField.propTypes = {
    onChange: func,
    onFocus: func
};
