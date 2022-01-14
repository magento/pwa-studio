import React, { useMemo } from 'react';
import { array, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import AttributeType from './AttributeType';
import defaultClasses from './customAttributes.module.css';

const CustomAttributes = props => {
    const { customAttributes } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const list = useMemo(
        () =>
            customAttributes.reduce((previousAttribute, currentAttribute) => {
                // Visible on front attributes only
                if (
                    currentAttribute.attribute_metadata.is_visible_on_front ===
                    true
                ) {
                    const attributeContent = (
                        <li
                            key={currentAttribute.attribute_metadata.uid}
                            className={classes.listItem}
                        >
                            <AttributeType data={currentAttribute} />
                        </li>
                    );

                    previousAttribute.push(attributeContent);
                }

                return previousAttribute;
            }, []),
        [classes, customAttributes]
    );

    if (list.length === 0) {
        return null;
    }

    return (
        <div className={classes.root}>
            <p className={classes.title}>
                <FormattedMessage
                    id={'customAttributes.title'}
                    defaultMessage={'Details'}
                />
            </p>
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
