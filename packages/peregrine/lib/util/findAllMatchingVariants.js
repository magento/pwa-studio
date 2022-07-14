/**
 * TODO Document
 */
export const findAllMatchingVariants = ({
    variants,
    optionCodes,
    singleOptionSelection
}) => {
    return variants.filter(({ attributes, product }) => {
        const customAttributes = (attributes || []).reduce(
            (map, { code, value_index }) => new Map(map).set(code, value_index),
            new Map()
        );
        //console.log('New File here customAttributes', customAttributes);
        console.log('new singleOptionSelection', singleOptionSelection);
        for (const [id, value] of singleOptionSelection) {
            const code = optionCodes.get(id);
            //if (!value) return false;

            const matchesStandardAttribute = product[code] === value;

            const matchesCustomAttribute = customAttributes.get(code) === value;

            console.log('here value value', value);
            console.log('here value two', customAttributes.get(code));

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
