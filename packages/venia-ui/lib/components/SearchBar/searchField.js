import React from 'react';
import { func, shape, string } from 'prop-types';
import { Search as SearchIcon, X as ClearIcon } from 'react-feather';
import { useSearchField } from '@magento/peregrine/lib/talons/SearchBar';

import Icon from '../Icon';
import TextInput from '../TextInput';
import Trigger from '../Trigger';

const clearIcon = <Icon src={ClearIcon} size={18} />;
const searchIcon = <Icon src={SearchIcon} size={18} />;

const SearchField = props => {
    const { location, onChange, onFocus } = props;
    const talonProps = useSearchField({ location, onChange });
    const { resetForm, value } = talonProps;

    const resetButton = value ? (
        <Trigger action={resetForm}>{clearIcon}</Trigger>
    ) : null;

    return (
        <TextInput
            after={resetButton}
            before={searchIcon}
            field="search_query"
            onFocus={onFocus}
            onValueChange={onChange}
        />
    );
};

export default SearchField;

SearchField.propTypes = {
    location: shape({
        search: string
    }).isRequired,
    onChange: func,
    onFocus: func
};
