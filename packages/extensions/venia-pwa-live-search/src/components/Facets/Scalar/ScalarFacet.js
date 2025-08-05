/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import React from 'react';
import { InputButtonGroup } from '../../InputButtonGroup';
import useScalarFacet from '../../../hooks/useScalarFacet';

const ScalarFacet = ({ filterData }) => {
    const { isSelected, onChange } = useScalarFacet(filterData);

    return (
        <InputButtonGroup
            title={filterData.title}
            attribute={filterData.attribute}
            buckets={filterData.buckets}
            type="checkbox"
            isSelected={isSelected}
            onChange={args => onChange(args.value, args.selected)}
        />
    );
};

export default ScalarFacet;
