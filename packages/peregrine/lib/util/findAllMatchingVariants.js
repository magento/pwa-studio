/**
 * Find all the products/variants contains current option selections
 * @return {Array} variants
 */
const isSameOptionValue = (left, right) =>
    left !== undefined &&
    left !== null &&
    right !== undefined &&
    right !== null &&
    String(left) === String(right);

export const findAllMatchingVariants = ({
    variants,
    optionCodes,
    singleOptionSelection
}) => {
    return variants?.filter(({ attributes, product }) => {
        const customAttributes = (attributes || []).reduce(
            (map, { code, value_index }) => new Map(map).set(code, value_index),
            new Map()
        );
        for (const [id, value] of singleOptionSelection) {
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
        // and these are the correct variants
        return true;
    });
};
