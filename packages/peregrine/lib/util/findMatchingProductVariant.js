/**
 * TODO Document
 */
const isSameOptionValue = (left, right) =>
    left !== undefined &&
    left !== null &&
    right !== undefined &&
    right !== null &&
    String(left) === String(right);

export const findMatchingVariant = ({
    variants,
    optionCodes,
    optionSelections
}) => {
    return variants.find(({ attributes, product }) => {
        const customAttributes = (attributes || []).reduce(
            (map, { code, value_index }) => new Map(map).set(code, value_index),
            new Map()
        );

        for (const [id, value] of optionSelections) {
            if (value === undefined || value === null) {
                continue;
            }

            const code = optionCodes.get(id);
            if (!code) {
                return false;
            }

            const matchesStandardAttribute = isSameOptionValue(
                product ? product[code] : undefined,
                value
            );
            const matchesCustomAttribute = isSameOptionValue(
                customAttributes.get(code),
                value
            );

            // if any option selection fails to match any standard attribute
            // and also fails to match any custom attribute
            // then this isn't the correct variant
            if (!matchesStandardAttribute && !matchesCustomAttribute) {
                return false;
            }
        }

        // otherwise, every option selection matched
        // and this is the correct variant
        return true;
    });
};
