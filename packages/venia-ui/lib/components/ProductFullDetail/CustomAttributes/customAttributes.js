import React, { useMemo } from 'react';
import { array, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';

import AttributeType from './AttributeType';
import defaultClasses from './customAttributes.module.css';

export const IS_VISIBLE_ON_FRONT = 'PRODUCT_DETAILS_PAGE';

const CustomAttributes = props => {
    const { customAttributes, showLabels } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const list = useMemo(
        () =>
            customAttributes.reduce((previousAttribute, currentAttribute) => {
                const usedInComponents =
                    currentAttribute.attribute_metadata?.used_in_components ||
                    [];
                // Visible on front attributes only
                if (usedInComponents.includes(IS_VISIBLE_ON_FRONT)) {
                    const attributeContent = (
                        <li
                            key={currentAttribute.attribute_metadata.uid}
                            className={classes.listItem}
                        >
                            <AttributeType
                                showLabels={showLabels}
                                data={currentAttribute}
                            />
                        </li>
                    );

                    previousAttribute.push(attributeContent);
                }

                return previousAttribute;
            }, []),
        [classes, customAttributes, showLabels]
    );

    if (list.length === 0) {
        return null;
    }

    return (
        <div className={classes.root}>
            <ul className={classes.list}>{list}</ul>
        </div>
    );
};

CustomAttributes.propTypes = {
    classes: shape({
        root: string,
        title: string,
        list: string,
        listItem: string
    }),
    customAttributes: array.isRequired
};

export default CustomAttributes;
