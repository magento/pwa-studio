import React from 'react';
import { useFormApi, useFieldState } from 'informed';
import { Search as SearchIcon, X as ClearIcon } from 'react-feather';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import TextInput from '../TextInput';
import Trigger from '../Trigger';
import defaultClasses from './filterSearch.css';

const clearIcon = <Icon src={ClearIcon} size={18} />;
const searchIcon = <Icon src={SearchIcon} size={18} />;

const FilterSearch = props => {
    const { name } = props;
    const { reset } = useFormApi();
    const { value } = useFieldState('filter_search');
    const classes = mergeClasses(defaultClasses, props.classes);

    const resetButton = value ? (
        <Trigger action={reset}>{clearIcon}</Trigger>
    ) : null;

    return (
        <div className={classes.root}>
            <TextInput
                after={resetButton}
                before={searchIcon}
                field="filter_search"
                placeholder={`Enter a ${name}`}
            />
        </div>
    );
};

export default FilterSearch;
