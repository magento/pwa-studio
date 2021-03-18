import React, { useMemo } from 'react';

import classes from './subTypeAttribute.css';
import operations from './subTypeAttribute.gql';
import { useQuery } from '@apollo/client';

const SubTypeAttribute = props => {
    const { item } = props;
    const { sub_type } = item;

    const { getAttributeMetadataQuery } = operations;
    const { data } = useQuery(getAttributeMetadataQuery, {
        skip: !sub_type
    });

    const attributeLabel = useMemo(() => {
        if (!sub_type || !data) return null;

        const attributeOptions =
            data.customAttributeMetadata.items[0].attribute_options;
        const attributeOption = attributeOptions.find(
            attribute => attribute.value == sub_type
        );

        return attributeOption.label;
    }, [data, sub_type]);

    if (!sub_type) return null;

    return <span className={classes.root}>{attributeLabel}</span>;
};

export default SubTypeAttribute;
