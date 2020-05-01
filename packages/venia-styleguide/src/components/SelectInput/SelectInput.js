import React from 'react';
import { ChevronDown } from 'react-feather';

const CHEVRON = <ChevronDown />;

import TextInput from '../TextInput';

const SelectInput = props => {
    return <TextInput {...props} after={CHEVRON} type="select" />;
};

export default SelectInput;
