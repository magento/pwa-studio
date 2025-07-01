import React from 'react';
import useRangeFacet from '../../../hooks/useRangeFacet';
import { InputButtonGroup } from '../../InputButtonGroup';

const RangeFacet = ({ filterData }) => {
    const { isSelected, onChange } = useRangeFacet(filterData);

    return (
        <InputButtonGroup
            title={filterData.title}
            attribute={filterData.attribute}
            buckets={filterData.buckets}
            type="radio"
            isSelected={isSelected}
            onChange={e => onChange(e.value)}
        />
    );
};

export default RangeFacet;
