import { useCallback } from 'react';

/**
 * @param {Object} props.typeConfig - component types configuration object
 *
 * @returns {{
 *  getAttributeTypeConfig: function
 * }}
 */
export const useAttributeType = props => {
    const { typeConfig = {} } = props;

    // Retrieve a attribute types configuration
    const getAttributeTypeConfig = useCallback(
        attributeType => {
            if (typeConfig[attributeType]) {
                return typeConfig[attributeType];
            }
        },
        [typeConfig]
    );

    return {
        getAttributeTypeConfig
    };
};
